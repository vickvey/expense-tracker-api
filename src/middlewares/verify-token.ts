import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "@/utils/jwt";
import { StatusCodes } from "http-status-codes";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Token from cookie or Authorization header

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token required for access" });
  }

  // Verify the JWT using the utility function
  const decoded = verifyJwt(token); // Calls the verifyJwt function from utils/jwt.ts

  if (!decoded || !decoded.userId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Invalid or expired token" });
  }

  // Attach the decoded user data to the request object
  req.currentUser = {
    userId: decoded.userId,
    role: decoded.role,
  };
  next(); // Proceed to the next middleware/route handler
};

export default verifyToken;
