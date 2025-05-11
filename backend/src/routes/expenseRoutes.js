import express from "express";
import Expense from "../models/Expense.js";
import protectRoute from "../middleware/auth.middleware.js";
import Wallet from "../models/Wallet.js";

const router = express.Router();

// Create expense
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, value, category, type, wallet } = req.body;

    if (!name || !value || !type || !category || !wallet) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const expense = new Expense({
      name,
      value,
      category,
      wallet,
      type,
      user: req.user._id,
    });

    await expense.save();

    // Add expense to balance
    const transactionAmount = Number(value) || 0;
    const multiplier = category === "income" ? 1 : -1;
    const amount = parseFloat((multiplier * transactionAmount).toFixed(2));

    await Wallet.findByIdAndUpdate(
      wallet,
      {
        $inc: {
          balance: amount,
          ...(category === "income" ? { income: Math.abs(amount) } : {}),
          ...(category === "expense" ? { expense: Math.abs(amount) } : {}),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(expense);
  } catch (error) {
    console.log("Error creating expense", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Edit expense
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, category, type, wallet } = req.body;

    // Validate required fields
    if (!name || !value || !type || !category || !wallet) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = req.user._id;

    // Check if expense exists and belongs to user
    const existingExpense = await Expense.findOne({
      _id: id,
      user,
    });

    if (!existingExpense) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Undo balance
    const transactionAmount = Number(existingExpense.value) || 0;
    const multiplier = existingExpense.category === "income" ? -1 : 1;
    const amount = parseFloat((multiplier * transactionAmount).toFixed(2));

    await Wallet.findByIdAndUpdate(
      existingExpense.wallet,
      {
        $inc: {
          balance: amount,
          ...(existingExpense.category === "income"
            ? { income: Math.abs(amount) * -1 }
            : {}),
          ...(existingExpense.category === "expense"
            ? { expense: Math.abs(amount) * -1 }
            : {}),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Update balance on new wallet
    const newTransactionAmount = Number(value) || 0;
    const newMultiplier = category === "income" ? 1 : -1;
    const newAmount = parseFloat(
      (newMultiplier * newTransactionAmount).toFixed(2)
    );

    await Wallet.findByIdAndUpdate(
      wallet,
      {
        $inc: {
          balance: newAmount,
          ...(category === "income" ? { income: Math.abs(newAmount) } : {}),
          ...(category === "expense" ? { expense: Math.abs(newAmount) } : {}),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Update the type
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, value, category, type, wallet },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all expenses (pagination)
router.get("/", protectRoute, async (req, res) => {
  try {
    const { wallet } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const expense = await Expense.find()
      .sort({ createdAt: -1 }) //desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalExpenseItem = await Expense.countDocuments();

    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    if (!wallet) {
      const result = await Wallet.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$balance" },
            totalExpense: { $sum: "$expense" },
            totalIncome: { $sum: "$income" },
          },
        },
      ]);
      balance = result[0]?.totalBalance;
      totalIncome = result[0]?.totalIncome;
      totalExpense = result[0]?.totalExpense;
    } else {
      const result = await Wallet.findById(wallet);
      balance = result?.balance || 0;
      totalIncome = result?.income || 0;
      totalExpense = result?.expense || 0;
    }

    res.send({
      expense,
      currentPage: page,
      totalExpenseItem,
      totalPages: Math.ceil(totalExpenseItem / limit),
      balance,
      totalIncome,
      totalExpense,
    });
  } catch (error) {
    console.log("Error in getting all expenses", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete expense
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Undo balance
    const transactionAmount = Number(expense.value) || 0;
    const multiplier = expense.category === "income" ? -1 : 1;
    const amount = parseFloat((multiplier * transactionAmount).toFixed(2));

    await Wallet.findByIdAndUpdate(
      expense.wallet,
      {
        $inc: {
          balance: amount,
          ...(expense.category === "income"
            ? { income: Math.abs(amount) * -1 }
            : {}),
          ...(expense.category === "expense"
            ? { expense: Math.abs(amount) * -1 }
            : {}),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

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
