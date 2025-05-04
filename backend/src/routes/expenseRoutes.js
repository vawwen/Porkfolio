import express from "express";
import Expense from "../models/Expense.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Create expense
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, value, category, type } = req.body;

    if (!name || !value || !type || !category) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const expense = new Expense({
      name,
      value,
      category,
      type,
      user: req.user._id,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.log("Error creating expense", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all expenses (pagination)
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const expense = await Expense.find()
      .sort({ createdAt: -1 }) //desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalExpenseItem = await Expense.countDocuments();

    res.send({
      expense,
      currentPage: page,
      totalExpenseItem,
      totalPages: Math.ceil(totalExpenseItem / limit),
    });
  } catch (error) {
    console.log("Error in getting all expenses", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete expense type
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log("Error deleting expense", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all expenses
// router.get("/", protectRoute, async (req, res) => {
//   try {
//     const type = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(type);
//   } catch (error) {
//     console.log("Error in getting all expenses", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

export default router;
