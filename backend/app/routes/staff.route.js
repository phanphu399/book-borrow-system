import staffController from "../controllers/staff.controller.js";
import auth from "./../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();
router.post("/login", staffController.login);
router.post("/register", staffController.create);
router
  .route("/")
  .get(auth, staffController.findAll)
  .post(staffController.create)
  .delete(auth, staffController.deleteAll);

router
  .route("/:id")
  .get(auth, staffController.findOne)
  .put(auth, staffController.update)
  .delete(auth, staffController.deleteOne);

export default router;
