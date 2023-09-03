import { NextFunction, Request, Response } from "express";

const msg = "Esta rota não foi encontrada!";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, mesage: msg, error: msg });
};
