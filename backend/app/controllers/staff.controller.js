import StaffService from "../services/staff.service.js";
import ApiError from "./../api-error.js";
const staffService = new StaffService();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function create(req, res, next) {
  if (!req.body?.username || !req.body?.password) {
    return next(new ApiError(400, "Username or password cannot be empty"));
  }
  try {
    if (await staffService.findOne({ username: req.body.username }))
      return next(new ApiError(409, "Username or password existed"));
    const doc = await staffService.create(req.body);
    if (!doc) return next(new ApiError(404, "Staff not found"));
    return res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    // console.log(req.body);
    return next(new ApiError(500, "Error while creating Staff "));
  }
}
export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Data to update cannot empty"));
  try {
    const doc = await staffService.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Staff not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while updating Staff"));
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await staffService.findByID(req.params.id);

    return doc
      ? res.status(200).json(doc)
      : next(new ApiError(404, "Staff not found"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding Staff"));
  }
}

export async function findAll(req, res, next) {
  let doc = [];
  try {
    const { fullName } = req.query;
    if (fullName) doc = await staffService.findByName(fullName);
    else doc = await staffService.find();
    return doc
      ? res.status(200).json(doc)
      : next(new ApiError(404, "Staff not found"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding Staff"));
  }
}
export async function deleteOne(req, res, next) {
  try {
    const doc = await staffService.delete(req.params.id);
    return doc
      ? res
          .status(200)
          .json({ message: `Staff ${doc.fullName} deleted successfully` })
      : next(new ApiError(404, "Staff not found"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while delete Staff"));
  }
}
export async function deleteAll(req, res, next) {
  try {
    const doc = await staffService.deleteAll();
    return doc
      ? res.status(200).json({ message: `Staff ${doc} deleted successfully` })
      : next(new ApiError(404, "Staff not found"));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while delete Staff"));
  }
}

export async function login(req, res, next) {
  if (!req.body?.username || !req.body?.password)
    return next(new ApiError(400, "Username or password cannot be empty"));
  try {
    const staff = await staffService.findByUserName(req.body.username);

    if (!staff) {
      return next(new ApiError(401, "Invalid username or password."));
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      staff.password
    );

    if (!passwordIsValid)
      return next(new ApiError(401, "Invalid username or password."));

    const payload = {
      id: staff._id,
      username: staff.username,
      role: staff.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" } // Token hết hạn sau 5 giờ
    );

    // Gửi token về Client
    return res.status(200).json({
      message: "Login successful.",
      staff: {
        id: staff._id,
        name: staff.fullName,
        username: staff.username,
        role: staff.role,
      },
      token: token,
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
