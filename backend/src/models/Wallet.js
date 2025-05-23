import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
    },
    balance: {
      type: Number,
      default: 0,
    },
    income: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
