import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (
  actualPasswordHash: string,
  passwordToCheck: string
) => {
  return await argon2.verify(actualPasswordHash, passwordToCheck);
};
