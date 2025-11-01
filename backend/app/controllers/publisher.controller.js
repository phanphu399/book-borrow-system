import PublisherService from "../services/publisher.service.js";
import ApiError from "../api-error.js";

const publisherService = new PublisherService();

export async function create(req, res, next) {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name cannot be empty"));
  }
  try {
    const doc = await publisherService.create(req.body);
    return res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return next(new ApiError(400, "Publisher already exists."));
    }
    return next(new ApiError(500, "Error while creating publisher"));
  }
}

export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }
  try {
    const doc = await publisherService.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Publisher not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Publisher ID."));
    }
    return next(new ApiError(500, "Error while updating publisher"));
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await publisherService.findByID(req.params.id);
    if (!doc) {
      return next(new ApiError(404, "Publisher not found."));
    }
    return res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Publisher ID."));
    }
    return next(new ApiError(500, "Error while finding publisher"));
  }
}

export async function findAll(req, res, next) {
  let document = [];
  try {
    const { name } = req.query;
    if (name) {
      document = await publisherService.findByName(name);
    } else {
      document = await publisherService.find({});
    }
    return res.status(200).json(document);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error while finding publisher"));
  }
}

export async function deleteOne(req, res, next) {
  try {
    const doc = await publisherService.deleteOne(req.params.id);
    if (!doc) return next(new ApiError(404, "Publisher not found"));
    return res.status(200).json({ message: "Publisher deleted successfully." });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Publisher ID."));
    }
    return next(new ApiError(500, "Error while deleting publisher"));
  }
}

export async function deleteAll(req, res, next) {
  try {
    const deleteCount = await publisherService.deleteAll();
    return res
      .status(200)
      .json({ message: `${deleteCount} publishers deleted successfully` });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error while deleting all publishers"));
  }
}

export default { create, findAll, findOne, update, deleteOne, deleteAll };
