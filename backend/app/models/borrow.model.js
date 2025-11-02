import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "borrowing", "returned", "overdue"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;
