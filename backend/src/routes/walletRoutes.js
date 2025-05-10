import express from "express";
import Wallet from "../models/Wallet.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Create wallet
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, icon, limit } = req.body;
    const userId = req.user._id;

    if (!name || !icon || !limit) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const walletCount = await Wallet.countDocuments({ user: userId });
    if (walletCount >= 5) {
      return res.status(400).json({
        message: "Maximum wallet limit (5) reached",
      });
    }

    const uploadRes = await cloudinary.uploader.upload(icon);
    const imageUrl = uploadRes.secure_url;

    const wallet = new Wallet({
      name,
      icon: imageUrl,
      limit,
      user: req.user._id,
    });

    await wallet.save();

    res.status(201).json(wallet);
  } catch (error) {
    console.log("Error creating wallet", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit wallet
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, limit } = req.body;

    // Validate required fields
    if (!name || !icon || !limit) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = req.user._id;

    // Check if wallet exists and belongs to user
    const existingWallet = await Wallet.findOne({
      _id: id,
      user,
    });

    if (!existingWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update the wallet
    const updatedWallet = await Wallet.findByIdAndUpdate(
      id,
      { name, icon, limit },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedWallet);
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all wallets
router.get("/", protectRoute, async (req, res) => {
  try {
    const wallet = await Wallet.find({ user: req.user._id }).sort({
      createdAt: 1,
    });
    res.json(wallet);
  } catch (error) {
    console.log("Error in getting all wallets", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete wallet
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (wallet.icon && wallet.icon.includes("cloudinary")) {
      try {
        const publicId = wallet.icon.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting icon from cloudinary", deleteError);
      }
    }

    await wallet.deleteOne();

    res.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.log("Error deleting wallet", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
