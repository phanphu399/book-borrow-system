import express from "express";
import BookController from "../controllers/book.controller.js";

const router = express.Router();

router
  .route("/")
  .get(BookController.findAll)
  .post(BookController.create)
  .put(BookController.update)
  .delete(BookController.deleteAll);

router
  .route("/:id")
  .get(BookController.findOne)
  .put(BookController.update)
  .delete(BookController.deleteOne);
export default router;
