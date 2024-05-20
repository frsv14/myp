import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const datetime = new Date();
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const seconds = datetime.getSeconds();
  let msg = console.log(
    "[" +
      (Number(hours) > 9 ? hours : "0" + hours) +
      ":" +
      (Number(minutes) > 9 ? minutes : "0" + minutes) +
      ":" +
      (Number(seconds) > 9 ? seconds : "0" + seconds) +
      "]" +
      " #" +
      req.originalUrl +
      " @" +
      req.ip,
  );
  next();
}
