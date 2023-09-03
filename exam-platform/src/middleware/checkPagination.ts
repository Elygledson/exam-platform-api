import { Request, Response, NextFunction } from "express";

export const checkPagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const take = parseInt(req.query.take?.toString()) || 500;
  const skip = parseInt(req.query.skip?.toString()) || 0;
  req["take"] = take;
  req["skip"] = skip;
  next();
};
