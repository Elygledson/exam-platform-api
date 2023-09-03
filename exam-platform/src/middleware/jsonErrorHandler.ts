import { NextFunction, Request, Response } from "express";

export const jsonErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ success: false, message: err.message, error: err });
};
