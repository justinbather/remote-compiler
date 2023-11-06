import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DockerCompiler from "./DockerCompiler.js";
import { languages } from "./languages.js";
import { subscribe } from "./subscriber.js";

const app = express();
const port = 5050;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});

subscribe();

app.post("/test", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log("server running");
});
