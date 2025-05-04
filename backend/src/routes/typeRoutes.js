import express from "express";
import Type from "../models/Type.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Create expense type
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingType = await Type.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Expense type already exists" });
    }

    const existingIcon = await Type.findOne({ icon });
    if (existingIcon) {
      return res
        .status(400)
        .json({ message: "Expense with chosen icon already exists" });
    }

    const uploadRes = await cloudinary.uploader.upload(icon);
    const imageUrl = uploadRes.secure_url;

    const type = new Type({
      name,
      icon: imageUrl,
      user: req.user._id,
    });

    await type.save();

    res.status(201).json(type);
  } catch (error) {
    console.log("Error creating type", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all expense type
router.get("/", protectRoute, async (req, res) => {
  try {
    const type = await Type.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(type);
  } catch (error) {
    console.log("Error in getting all expense type", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete expense type
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Expense type not found" });
    }

    if (type.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (type.icon && type.icon.includes("cloudinary")) {
      try {
        const publicId = type.icon.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting icon from cloudinary", deleteError);
      }
    }

    await type.deleteOne();

    res.json({ message: "Expense type deleted successfully" });
  } catch (error) {
    console.log("Error deleting expense type", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all expense type (pagination)
// router.get("/", protectRoute, async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const limit = req.query.limit || 5;
//     const skip = (page - 1) * limit;

//     const type = await Type.find()
//       .sort({ createdAt: 1 }) //asc
//       .skip(skip)
//       .limit(limit)
//       .populate("user", "username profileImage");

//     const totalType = await Type.countDocuments();

//     res.send({
//       type,
//       currentPage: page,
//       totalType,
//       totalPages: Math.ceil(totalType / limit),
//     });
//   } catch (error) {
//     console.log("Error in getting all expense type", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

export default router;
