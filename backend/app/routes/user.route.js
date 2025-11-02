import userController from "../controllers/user.controller.js";
import express from "express";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/login", userController.login);
router.post("/register", userController.create);
router
  .route("/")
  .get(auth, userController.findAll)
  .post(userController.create)
  .delete(auth, userController.deleteAll);

router
  .route("/:id")
  .get(auth, userController.findOne)
  .put(auth, userController.update)
  .delete(auth, userController.deleteOne);
export default router;
