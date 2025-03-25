import { prisma } from "../config/db.js";
import argon2 from "argon2";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function registerUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return ApiResponse.error(res, 401, "User email or password is required");
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return ApiResponse.error(res, 403, `User ${email} already existing`);
    const hashedPassword = await argon2.hash(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    if (!newUser) throw new Error(`Error creating User ${email}!`);
    return ApiResponse.send(
      res,
      201,
      `User ${email} created successfully`,
      newUser
    );
  } catch (error) {
    console.error(error);
    return ApiResponse.error(res, 500, "Internal Server Error");
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return ApiResponse.error(res, 401, "User email or password is required");
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser)
      return ApiResponse.error(res, 403, `User ${email} doesn't exist`);
    const isMatching = await argon2.verify(existingUser.password, password);
    if (!isMatching) return ApiResponse.error(res, 401, "Unauthorized Access");

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      signed: true,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      // TODO: In production, Uncomment this
      // secure: true,
    });
    ApiResponse.send(
      res,
      200,
      `Login granted to User ${existingUser.email}`,
      existingUser
    );
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, "Internal Server Error");
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function logoutUser(req, res) {
  if (!req.signedCookies.jwt || !jwt.verify(req.signedCookies.jwt, JWT_SECRET))
    return ApiResponse.error(res, 403, "jwt token is not found");

  res.clearCookie("jwt");
  ApiResponse.send(res, 200, `Logout Successfull`);
}
