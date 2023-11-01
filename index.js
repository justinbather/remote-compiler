import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DockerCompiler from "./DockerCompiler.js";
import { languages } from "./languages.js";

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

app.post("/compile-test", (req, res) => {
  let start = performance.now();
  const code = req.body.code;
  const problem = req.body.problem;

  //* Grab index in languages array so we know how to run the code in the container
  let idx = languages.findIndex((el) => el.lang === problem.language);

  let DockCompiler = new DockerCompiler(
    code,
    languages[idx].lang,
    languages[idx].executor,
    languages[idx].fileExt,
    languages[idx].dockerImage,
    problem.filePrefix,
    problem.inputCode,
    problem.output,
    problem.callerCode
  );

  DockCompiler.run(function (stdout, error, hints) {
    if (stdout) {
      console.log("stdout: ", stdout);

      let end = performance.now();
      console.log(`Complete server request took: ${end - start}ms`);
      console.log("sending response1");
      return res

        .status(200)
        .json({ output: stdout, hints: hints, success: true });
    } else {
      let end = performance.now();
      console.log(`Complete server request took: ${end - start}ms`);
      console.log("sending response2");
      res.status(200).json({ output: error, hints: hints, success: false });
    }
  });
});

app.post("/test", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log("server running");
});
