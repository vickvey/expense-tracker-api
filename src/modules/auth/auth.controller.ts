// auth.controller.ts

import { NextFunction, Request, Response } from "express";
import * as AuthService from "./auth.service";
import { AuthRegistrationDTO } from "./auth.types";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response, _next: NextFunction) => {
  const data: AuthRegistrationDTO = req.body;
  await AuthService.registerUser(data); // Let it throw
  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
  });
};

/// TODO
const login = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK);
};

/// TODO
const logout = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK);
};

export { register, login, logout };
