import ReaderService from "../services/reader.service.js";
import ApiError from "../api-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const readerService = new ReaderService();

export async function create(req, res, next) {
  if (!req.body?.username || !req.body?.password)
    return next(new ApiError(400, "Username or password cannot be empty"));
  try {
    const doc = await readerService.create(req.body);
    return res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating reader"));
  }
}

export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot empty"));
  }
  try {
    const doc = await readerService.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Reader not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while updating reader "));
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await readerService.findByID(req.params.id);
    if (!doc) return next(new ApiError(404, "Reader not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding reader"));
  }
}

export async function findAll(req, res, next) {
  let doc = [];
  try {
    const { firstName } = req.query;
    if (firstName) doc = await readerService.findByName(firstName);
    else doc = await readerService.find();

    return doc ? res.status(200).json(doc) : "Reader not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding reader "));
  }
}
export async function deleteOne(req, res, next) {
  try {
    const doc = await readerService.delete(req.params.id);

    return doc
      ? res
          .status(200)
          .json({ message: `Reader ${req.query.name} deleted successfully` })
      : "Reader not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export async function deleteAll(req, res, next) {
  try {
    const doc = await readerService.deleteAll();

    return doc
      ? res.status(200).json({ message: ` ${doc} reader deleted successfully` })
      : "Reader not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export async function login(req, res, next) {
  if (!req.body?.username || !req.body?.password)
    return next(new ApiError(400, "Username or password cannot be empty"));
  try {
    const { username, password } = req.body;

    const reader = await ReaderService.findByUserName(username);
    if (!reader)
      return next(new ApiError(401, "Invalid username or password."));

    const passwordIsValid = await bcrypt.compare(password, reader.password);
    if (!passwordIsValid)
      return next(new ApiError(401, "Invalid username or password."));

    const payload = {
      id: reader._id,
      username: reader.username,
      role: reader.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    return res.status(200).json({
      message: "Login successful.",
      reader: {
        id: reader._id,
        username: reader.username,
        role: reader.role,
      },
      token: token, // Gửi token về Client
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error during login process."));
  }
}
export default {
  create,
  findOne,
  findAll,
  update,
  deleteOne,
  deleteAll,
  login,
};
