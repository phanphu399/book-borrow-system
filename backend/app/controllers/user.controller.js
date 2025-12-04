import UserService from "../services/user.service.js";
import ApiError from "../api-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userService = new UserService();

export async function create(req, res, next) {
  if (!req.body?.username || !req.body?.password)
    return next(new ApiError(400, "Username or password cannot be empty"));
  try {
    if (await userService.findOne({ username: req.body.username }))
      return next(new ApiError(409, "Username or password existed"));
    const doc = await userService.create(req.body);
    return res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating User"));
  }
}

export async function checkUserName(req, res, next) {
  try {
    const userExists = await userService.findOne({ username });

    if (userExists) {
      return next(new ApiError(409, "Username existed"));
    } else {
      return res.status(200).json({ message: "Username is unique." });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra tính duy nhất:", error);
    return next(new ApiError(500, "Error while finding username for checking"));
  }
}

export async function update(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot empty"));
  }
  try {
    const doc = await userService.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "User not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while updating User "));
  }
}

export async function findOne(req, res, next) {
  try {
    const doc = await userService.findByID(req.params.id);
    if (!doc) return next(new ApiError(404, "User not found"));
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding User"));
  }
}

export async function findAll(req, res, next) {
  let doc = [];
  try {
    const { firstName } = req.query;
    if (firstName) doc = await userService.findByName(firstName);
    else doc = await userService.find();

    return doc ? res.status(200).json(doc) : "User not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while finding User "));
  }
}
export async function deleteOne(req, res, next) {
  try {
    const doc = await userService.delete(req.params.id);

    return doc
      ? res
          .status(200)
          .json({ message: `User ${req.query.name} deleted successfully` })
      : "User not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export async function deleteAll(req, res, next) {
  try {
    const doc = await userService.deleteAll();

    return doc
      ? res.status(200).json({ message: ` ${doc} User deleted successfully` })
      : "User not found";
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error while creating "));
  }
}

export async function login(req, res, next) {
  if (!req.body?.username || !req.body?.password)
    return next(new ApiError(400, "Username or password cannot be empty"));
  try {
    const User = await userService.findByUserName(req.body.username);
    if (!User) {
      return next(new ApiError(401, "Invalid username or password."));
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      User.password
    );

    if (!passwordIsValid)
      return next(new ApiError(401, "Invalid username or password."));

    const payload = {
      id: User._id,
      username: User.username,
      role: User.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" } // Token hết hạn sau 5 giờ
    );

    return res.status(200).json({
      message: "Login successful.",
      user: {
        name: User.lastName + " " + User.firstName,
        id: User._id,
        username: User.username,
        role: User.role,
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
