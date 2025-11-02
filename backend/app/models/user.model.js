import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    birthDate: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "reader",
    },
    username: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
