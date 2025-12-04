import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, trim: true },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Publisher = mongoose.model("Publisher", publisherSchema);
export default Publisher;
