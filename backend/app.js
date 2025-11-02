import express from "express";
import cors from "cors";
import ApiError from "./app/api-error.js";
import bookRouter from "./app/routes/book.route.js";
import publisherRouter from "./app/routes/publisher.route.js";
import userRouter from "./app/routes/user.route.js";
import staffRouter from "./app/routes/staff.route.js";
import borrowRouter from "./app/routes/borrow.route.js";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CTU Book Borrow System !" });
});

app.use("/api/book", bookRouter);
app.use("/api/publisher", publisherRouter);
app.use("/api/user", userRouter);
app.use("/api/staff", staffRouter);
app.use("/api/borrow", borrowRouter);
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});
export default app;
