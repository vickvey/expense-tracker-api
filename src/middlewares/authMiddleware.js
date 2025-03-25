import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default async function authMiddleware(req, res, next) {
  if (!req.signedCookies.jwt)
    return ApiResponse.error(res, 401, "Unauthorized Access");

  try {
    const decoded = jwt.verify(req.signedCookies.jwt, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return ApiResponse.error(res, 401, "Unauthorized Access!");
  }
}
