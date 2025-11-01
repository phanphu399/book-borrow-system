import borrowController from "../controllers/borrow.controller.js";
import auth from "./../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router
  .route("/")
  .get(auth, borrowController.findAll)
  .post(borrowController.create)
  .delete(auth, borrowController.deleteAll);

router
  .route("/:id")
  .get(auth, borrowController.findOne)
  .put(auth, borrowController.update)
  .delete(auth, borrowController.deleteOne);
export default router;
