import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DockerCompiler from "./DockerCompiler.js";
import { languages } from "./languages.js";

const app = express();
const port = 8080;

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

app.post("/compile-test", (req, res) => {
  let start = console.time();
  const code = req.body.code;
  const lang = req.body.lang;

  //* Grab index in languages array so we know how to run the code in the container
  let idx = languages.findIndex((el) => el.lang === lang);

  let DockCompiler = new DockerCompiler(
    code,
    languages[idx].lang,
    languages[idx].executor,
    languages[idx].fileExt,
    languages[idx].dockerImage
  );

  const mockTest = (stdout) => {
    const expected = "hello";
    console.log(expected === stdout.trim());
    return stdout.trim() === expected; //* stdout has newline character so we need to compare the trimmed value
  };

  DockCompiler.run(function (stdout, error, hints) {
    if (stdout) {
      console.log(stdout);
      // let testResult = mockTest(stdout);
      return res
        .status(200)
        .json({ output: stdout, hints: hints, success: true });
    } else {
      return res
        .status(200)
        .json({ output: error, hints: hints, success: false });
    }
  });
});

app.listen(port, () => {
  console.log("server running");
});
