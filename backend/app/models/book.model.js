import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      trim: true,
    },
    publisher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    image_URL: {
      type: String,
      default:
        "https://www.pngplay.com/wp-content/uploads/15/Blue-Book-PNG-Background.png",
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
