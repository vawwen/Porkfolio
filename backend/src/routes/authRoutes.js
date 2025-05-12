import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protectRoute from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import Wallet from "../models/Wallet.js";
import Type from "../models/Type.js";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// User registration
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 characters long" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage,
    });

    await user.save();

    const wallet = new Wallet({
      name: "Your Wallet",
      icon: profileImage,
      limit: 10000,
      user: user._id,
    });

    await wallet.save();

    const defaultType = [
      {
        name: "Food",
        icon: "restaurant-outline",
        category: "expense",
      },
      {
        name: "Transport",
        icon: "car-outline",
        category: "expense",
      },
      {
        name: "Entertainment",
        icon: "game-controller-outline",
        category: "expense",
      },
      {
        name: "Salary",
        icon: "briefcase-outline",
        category: "income",
      },
      {
        name: "Cash",
        icon: "cash-outline",
        category: "income",
      },
    ];
    for (let i = 0; i < defaultType.length; i++) {
      const type = new Type({
        name: defaultType[i].name,
        icon: defaultType[i].icon,
        category: defaultType[i].category,
        user: user._id,
      });
      await type.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User profile edit
router.put("/", protectRoute, async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;

    if (!username || !email || !profileImage) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userData = await User.findOne({
      _id: req.user._id,
    });

    const existingEmail = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }

    let imageUrl = userData.profileImage;
    if (userData.profileImage !== profileImage) {
      if (
        userData.profileImage &&
        userData.profileImage.includes("cloudinary")
      ) {
        try {
          const publicId = userData.profileImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.log("Error deleting icon from cloudinary", deleteError);
        }
      }
      const uploadRes = await cloudinary.uploader.upload(profileImage);
      imageUrl = uploadRes.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, profileImage: imageUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error editing user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
