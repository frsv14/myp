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

  const db = await mysql.createConnection({
  
    host: "127.0.0.1",
    
    user: "freddy", //ditt användar namn
    
    password: "abc", //ditt lösen ord
    
    database: "databas", // vilken databas OBS! om du ändrar denna se till att den har tabellerna msg och user (se sql fil)
  });

  app.use(logger);

  app.use(express.urlencoded({ extended: false }));

  app.get("/input", async function (req: any, res: any) {
    
    
    let m = new Date();
    let y = new Date();
    let d = new Date();
    let dd = d.getDate();
    let yy = y.getFullYear();
    let mm = m.getMonth();
    const msg = req.query.msg;
    const user = "'"+req.query.user+"'";
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

  app.get("/login", async function (req, res) {
    if (
      req.query &&
      typeof req.query.user === "string" &&
      typeof req.query.password === "string"
    ) {
      const user_name = req.query.user;
      const password = crypto
        .createHash("md5")
        .update(String(req.query.password))
        .digest("hex");
      let question = "SELECT name,password FROM user WHERE name =?";
      const user_answer = await db.execute(question, [user_name]);
      const output = user_answer[0].some((element :any) => true); // DET SKA VA SÅ   
      
      if(output ===  false){
         res.send("fel användarnamn");
      }else{
        const password_from_database = user_answer.values().next().value[0].password;
        const encryptdbpass = crypto
        .createHash("md5")
        .update(String(password_from_database))
        .digest("hex");
        
        if (encryptdbpass === password) {
          const token = uuid();
          console.log(token);
          token_storage[token] = user_name;
          console.log("evenmore hu?")
          res.cookie("login", token, { maxAge: 1000000 });
          res.send("Du är inloggad!");
      
        } else {
          console.log("hu?")
          res.send("Fel lösenord eller användarnamn!");
        }
      }
    } else {
      res.send("Du har inte skrivit in anvädnarnamn eller lösenord!");
    }
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
