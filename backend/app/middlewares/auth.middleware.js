import ApiError from "../api-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(
        401,
        "Access Denied: No token provided or token format is invalid."
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid Token."));
  }
}

export default verifyToken;
