import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import fs from "fs-extra";

export function notFound(req: Request, res: Response, next: NextFunction) {
  fs.readFile("public/404.html", "utf-8").then((data) => {
    res.status(404).send(data);
  });
}

export function serverError(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  fs.readFile("public/500.html", "utf-8").then((data) => {
    res.status(500).send(data);
    console.error(err.toString());
  });
}
