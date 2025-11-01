import express from "express";

import publisherController from "../controllers/publisher.controller.js";
import auth from "./../middlewares/auth.middleware.js";
const router = express.Router();

router
  .route("/")
  .get(publisherController.findAll)
  .post(auth, publisherController.create)
  .delete(auth, publisherController.deleteAll);

router
  .route("/:id")
  .get(publisherController.findOne)
  .put(auth, publisherController.update)
  .delete(auth, publisherController.deleteOne);
export default router;
