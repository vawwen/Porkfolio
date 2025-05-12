import express from "express";
import Expense from "../models/Expense.js";
import protectRoute from "../middleware/auth.middleware.js";
import Wallet from "../models/Wallet.js";
import dayjs from "dayjs";

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

    let query = Expense.find();

    if (wallet) {
      query = query.where("wallet").equals(wallet);
    }

    query = query.where("user").equals(req.user._id);

    const expense = await query
      .sort({ createdAt: -1 }) //desc
      .skip(skip)
      .limit(limit)
      .populate("type");

    const countQuery = Expense.countDocuments();

    countQuery.where("user").equals(req.user._id);
    if (wallet) {
      countQuery.where("wallet").equals(wallet);
    }
    const totalExpenseItem = await countQuery;

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

// Analytics
router.get("/analytics", protectRoute, async (req, res) => {
  const { timeType, wallet } = req.query;

  try {
    // Get current week's start (Monday) and end (Sunday)
    const today = dayjs();
    const startOfWeek = today.startOf("isoWeek").startOf("day");
    const endOfWeek = today.endOf("isoWeek").endOf("day");

    // Get start and end  of year
    const startOfYear = today.startOf("year").startOf("day");
    const endOfYear = today.endOf("year").endOf("day");

    const dateFormat = {
      weekly: "%Y-%m-%d",
      monthly: "%Y-%m",
      yearly: "%Y",
    }[timeType];

    const barData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          ...(wallet && {
            wallet,
          }),
          ...(timeType === "weekly" && {
            createdAt: {
              $gte: startOfWeek.toDate(),
              $lte: endOfWeek.toDate(),
            },
          }),
          ...(timeType === "monthly" && {
            createdAt: {
              $gte: startOfYear.toDate(),
              $lte: endOfYear.toDate(),
            },
          }),
        },
      },
      {
        $group: {
          _id: {
            period: {
              $dateToString: { format: dateFormat, date: "$createdAt" },
            },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$category", "income"] }, "$value", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$category", "expense"] }, "$value", 0] },
          },
          netTotal: {
            $sum: {
              $cond: [
                { $eq: ["$category", "income"] },
                "$value",
                { $multiply: ["$value", -1] },
              ],
            },
          },
        },
      },
      { $sort: { "_id.period": 1 } },
    ]);

    const pieData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          category: "expense", // Only expenses
          ...(wallet && {
            wallet,
          }),
          ...(timeType === "weekly" && {
            createdAt: {
              $gte: startOfWeek.toDate(),
              $lte: endOfWeek.toDate(),
            },
          }),
          ...(timeType === "monthly" && {
            createdAt: {
              $gte: startOfYear.toDate(),
              $lte: endOfYear.toDate(),
            },
          }),
        },
      },
      {
        $group: {
          _id: {
            type: "$type", // Group by type
          },
          total: { $sum: "$value" }, // Total per type
        },
      },
      {
        $lookup: {
          // Optional: Get type details
          from: "types",
          localField: "_id.type",
          foreignField: "_id",
          as: "typeDetails",
        },
      },
      { $unwind: "$typeDetails" }, // Flatten the array
      {
        $project: {
          period: "$_id.period",
          type: "$typeDetails.name", // Use the populated name
          total: 1,
          _id: 0,
        },
      },
      { $sort: { period: 1, total: -1 } }, // Sort by date then by amount
    ]);

    res.json({ barData, pieData });
  } catch (error) {
    console.log("Error in getting all expenses", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
