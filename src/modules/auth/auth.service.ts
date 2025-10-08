import { db } from "@/db/client";
import { AuthLoginDTO, AuthRegistrationDTO } from "./auth.types";
import { usersTable } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/utils/hash-password";
import { eq } from "drizzle-orm";
import { generateJwt } from "@/utils/jwt";

const registerUser = async (dto: AuthRegistrationDTO) => {
  await db.insert(usersTable).values({
    email: dto.email,
    passwordHash: await hashPassword(dto.password),
  });
  console.log(`User registered successfully: ${dto.email}`);
};

const loginUser = async (dto: AuthLoginDTO) => {
  // check for existing user
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, dto.email),
  });

  if (!existingUser) throw Error(`User with email: ${dto.email} not found`);

  // check for correct credentials
  const isCorrect = await verifyPassword(
    existingUser.passwordHash,
    dto.password
  );

  // generate jwt and return
  return generateJwt({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  });
};

const logoutUser = async () => {};
