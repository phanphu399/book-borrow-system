import staffController from "../controllers/staff.controller.js";
import auth from "./../middlewares/auth.middleware.js";
import express from "express";
const router = express();

router
  .route("/")
  .get(staffController.findAll)
  .post(staffController.create)
  .put(staffController.update)
  .delete(staffController.deleteAll);

router
  .route("/:id")
  .get(staffController.findOne)
  .put(staffController.update)
  .delete(staffController.deleteOne);

router.route("/login").post(staffController.login);

export default router;
