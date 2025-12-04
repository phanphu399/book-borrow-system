import BorrowService from "../services/borrow.service.js";
import ApiError from "../api-error.js";
const borrowService = new BorrowService();
async function create(req, res, next) {
  if (!req.body?.user_id || !req.body?.book_id || !req.body?.borrowDate) {
    return next(
      new ApiError(
        400,
        "Data to creating the book borrowing record cannot be empty"
      )
    );
  }

  // So lan muon cho mot quyen sach
  const bookBorrowCount = await borrowService.find({
    user_id: req.body.user_id,
    book_id: req.body.book_id,
    status: {
      $in: ["pending", "borrowing"],
    },
  });
  if (bookBorrowCount.length >= 3)
    return next(
      new ApiError(422, "Borrowing record for each book is limited to 3")
    );
  //Tong so lan muon sach
  const totalActiveBorrowCount = await borrowService.find({
    user_id: req.body.user_id,

    status: {
      $in: ["pending", "borrowing"],
    },
  });
  if (totalActiveBorrowCount.length >= 10)
    return next(new ApiError(409, "Borrowing record is limited to 10"));

  try {
    const doc = await borrowService.create(req.body);
    return res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Error while creating the book borrowing record")
    );
  }
}

export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot empty"));
  }
  try {
    const doc = await borrowService.update(req.params.id, req.body);
    if (!doc)
      return next(new ApiError(404, "The book borrowing record not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Error while updating the book borrowing record ")
    );
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await borrowService.findByID(req.params.id);
    if (!doc)
      return next(new ApiError(404, "The book borrowing record not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Error while finding the book borrowing record")
    );
  }
}

export async function findAll(req, res, next) {
  let doc = [];
  try {
    doc = await borrowService.find();
    return doc
      ? res.status(200).json(doc)
      : "The book borrowing record not found";
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Error while finding the book borrowing record ")
    );
  }
}
export async function deleteOne(req, res, next) {
  try {
    const doc = await borrowService.delete(req.params.id);

    return doc
      ? res.status(200).json({
          message: `The book borrowing record ${req.query.name} deleted successfully`,
        })
      : "The book borrowing record not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export async function deleteAll(req, res, next) {
  try {
    const doc = await borrowService.deleteAll();

    return doc
      ? res.status(200).json({
          message: `${doc} books borrowing record deleted successfully`,
        })
      : "The book borrowing record not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export default { create, deleteAll, deleteOne, update, findAll, findOne };
