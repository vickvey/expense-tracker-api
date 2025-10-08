import jwt from "jsonwebtoken";
import { JwtPayload } from "@/modules/auth/auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

// Function to generate a JWT token
export const generateJwt = (user: {
  userId: number;
  email: string;
  role: string;
}): string => {
  const payload: JwtPayload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    iat: Math.floor(Date.now() / 1000), // Current timestamp
  };

  // Sign the JWT with the secret
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" });
  return token;
};

// Function to verify a JWT token
export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    // Decode and verify the JWT, casting it to JwtPayload type
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null; // Return null if verification fails
  }
};

// Optional: Function to decode a JWT token (without verifying it)
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
};
