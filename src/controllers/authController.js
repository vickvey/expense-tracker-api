import { prisma } from "../config/db.js";
import argon2 from "argon2";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

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
    const existingUser = await getUserByEmail(email);

    if (existingUser)
      return ApiResponse.error(res, 409, `User ${email} already existing`);
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
  if (req.signedCookies.jwt)
    return ApiResponse.send(res, 200, "Already Logged In");

  const { email, password } = req.body;
  if (!email || !password)
    return ApiResponse.error(res, 401, "User email or password is required");
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return ApiResponse.error(res, 404, `User ${email} not found`);
    }

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
  try {
    if (!req.signedCookies.jwt) {
      return ApiResponse.error(res, 403, "JWT token is not found");
    }

    // Verify the JWT token
    jwt.verify(req.signedCookies.jwt, JWT_SECRET); // This can throw an error if token is invalid or expired
    res.clearCookie("jwt"); // Clear the cookie after verification
    ApiResponse.send(res, 200, `Logout Successful`);
  } catch (error) {
    ApiResponse.error(res, 401, "Invalid or expired JWT token");
  }
}
