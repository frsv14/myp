export { hello } from "./hello.js";
import fs, { promises } from "fs-extra";
import Mustache, { parse } from "mustache";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

type TokenData = { [key: string]: string };
const token_storage: TokenData = {};

import mysql from "mysql2/promise";
import express from "express";
import { logger } from "./logger.js";
import { notFound, serverError } from "./errors.js";
import * as path from "path";
//import bodyParse  from "body-parse";

export async function main() {
  const app = express();

  app.use("/", express.static("public"));
  app.use(express.json());

  const db = await mysql.createConnection({ //CREATE DATABASE databas; //USE databas; //CREATE TABLE msg (msg TEXT, created DATE, user TEXT);
    host: "127.0.0.1",
    user: "freddy",
    password: "abc",
    database: "databas",
  });

  app.use(logger);

  // If you need to parse url.
  app.use(express.urlencoded({ extended: false }));

  app.get("/msg", async function (req, res) {
    let question = "SELECT * FROM msg;";
    console.log(question);
    const result = await db.execute(question);
    console.log(db);
    const data = result.values().next().value;
    res.send(data);
  });

  app.post("/input/msg", async function (req, res) {
    res.send(req.body.msg);
  });

  app.get("/input", async function bees(req: any, res: any) {
    let m = new Date();
    let y = new Date();
    let d = new Date();
    let dd = d.getDate();
    let yy = y.getFullYear();
    let mm = m.getMonth();
    const msg = await req.query.msg;
    const user = "'krm'";
    const created = ["'" + yy + "-" + mm + "-" + dd + "'"];
    console.log(msg);
    const question =
      "INSERT INTO msg (msg, created, user) VALUES ('" +
      msg +
      "', " +
      created +
      ", " +
      user +
      " );";

    const result = await db.execute(question);
    console.log(question);

    return res.send(" OK! " + "  sending:" + msg);
  });

  app.post("/input", async function (req, res) {
    res.send(req.body.msg);
  });

  app.get("/error", function (req, res) {
    throw "Test throwing Error";
  });

  app.use(notFound);

  app.use(serverError);

  const port = 3000;

  app.listen(port, () => {
    console.log("You can find this server on: http://localhost:" + port);
  });
}

main();
