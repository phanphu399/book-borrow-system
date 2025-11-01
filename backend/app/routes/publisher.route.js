import express from "express";

import publisherController from "../controllers/publisher.controller.js";
const router = express.Router();

router
  .route("/")
  .get(publisherController.findAll)
  .post(publisherController.create)
  .put(publisherController.update)
  .delete(publisherController.deleteAll);

router
  .route("/:id")
  .get(publisherController.findOne)
  .put(publisherController.update)
  .delete(publisherController.deleteOne);
export default router;
