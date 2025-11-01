import readerController from "../controllers/reader.controller.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(readerController.findAll)
  .post(readerController.create)
  .put(readerController.update)
  .delete(readerController.deleteAll);

router
  .route("/:id")
  .get(readerController.findOne)
  .put(readerController.update)
  .delete(readerController.deleteOne);
export default router;
