// auth.controller.ts

import { NextFunction, Request, Response } from "express";
import * as AuthService from "./auth.service";
import { AuthLoginDTO, AuthRegistrationDTO } from "./auth.types";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response, _next: NextFunction) => {
  const data: AuthRegistrationDTO = req.body;
  await AuthService.registerUser(data); // Let it throw
  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
  });
};

const login = async (req: Request, res: Response) => {
  const data: AuthLoginDTO = req.body;
  const token = await AuthService.loginUser(data);

  // sign the cookie and set it
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
    signed: true, // sign cookie with COOKIE_SECRET
  });

  return res.status(StatusCodes.OK).json({
    message: "User Login Granted",
  });
};

/// TODO
const logout = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK);
};

export { register, login, logout };
