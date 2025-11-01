import BookService from "../services/book.service.js";
import ApiError from "../api-error.js";
const bookService = new BookService();

export async function create(req, res, next) {
  if (!req.body?.title) {
    return next(new ApiError(400, "Book title cannot be empty"));
  }

  try {
    const document = await bookService.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return next(new ApiError(400, "BookCode already exists."));
    }
    return next(new ApiError(500, "Error while creating book"));
  }
}

export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }
  try {
    const doc = await bookService.update(req.params.id, req.body);

    if (!doc) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Book ID."));
    }
    return next(new ApiError(500, "Error while update book"));
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await bookService.findByID(req.params.id);
    if (!doc) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Book ID."));
    }
    return next(new ApiError(500, "Error while finding book"));
  }
}

export async function findAll(req, res, next) {
  let document = [];
  try {
    const { title } = req.query;
    if (title) {
      document = await bookService.findByName(title);
    } else {
      document = await bookService.find({});
    }
    return res.status(200).json(document);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error while finding book"));
  }
}

export async function deleteOne(req, res, next) {
  try {
    const doc = await bookService.deleteOne(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Book not found"));
    }

    return res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return next(new ApiError(404, "Invalid Book ID."));
    }
    return next(new ApiError(500, "Error while deleting book"));
  }
}

export async function deleteAll(req, res, next) {
  try {
    const deletedCount = await bookService.deleteAll();

    return res.status(200).json({
      message: `${deletedCount} books deleted successfully!`,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Error while deleting all books"));
  }
}

export default { create, findOne, findAll, deleteAll, deleteOne, update };
