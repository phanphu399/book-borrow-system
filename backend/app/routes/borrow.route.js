import borrowController from "../controllers/borrow.controller.js";

import express from "express";

const router = express.Router();

router
  .route("/")
  .get(borrowController.findAll)
  .post(borrowController.create)
  .put(borrowController.update)
  .delete(borrowController.deleteAll);

router
  .route("/:id")
  .get(borrowController.findOne)
  .put(borrowController.update)
  .delete(borrowController.deleteOne);
export default router;
