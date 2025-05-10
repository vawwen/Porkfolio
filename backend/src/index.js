import express from "express";
import "dotenv/config";
import cors from "cors";
// import job from "./lib/cron.js"; uncomment if using cron

import authRoutes from "./routes/authRoutes.js";
import typeRoutes from "./routes/typeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// job.start(); uncomment if using cron
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/type", typeRoutes);
app.use("/api/wallet", walletRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
