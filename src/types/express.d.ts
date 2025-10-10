// src/types/express.d.ts
import { JwtPayload } from "@/modules/auth/auth.types"; // Import the JwtPayload type

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        // Only store userId and role, not the whole payload
        userId: number;
        role: string;
      };
    }
  }
}
