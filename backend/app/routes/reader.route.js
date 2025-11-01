import readerController from "../controllers/reader.controller.js";
import express from "express";
import auth from "./../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/login", readerController.login);
router.post("/register", readerController.create);
router
  .route("/")
  .get(auth, readerController.findAll)
  .post(readerController.create)
  .delete(auth, readerController.deleteAll);

router
  .route("/:id")
  .get(auth, readerController.findOne)
  .put(auth, readerController.update)
  .delete(auth, readerController.deleteOne);
export default router;
