import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DockerCompiler from "./DockerCompiler.js";
import { Languages } from "./languages.js";

const app = express();
const port = 3000;

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

//* Temporarily uses local string var with javascript to simulate the ability to use JSON.stringify
//* Will need to look into converting to binary on the front end before sending
app.post("/js-test", (req, res) => {
  const data = req.body;
  console.log(req);

  let str = `console.log('hello world')
  console.log('#2')
  const test = () => {
    
    return 'testing function'
  }
  console.log(test())
  `;
  let inputJSON = JSON.stringify(str);
  //   console.log(data);
  try {
    let strJSON = JSON.parse(inputJSON);
    eval(strJSON); //* runs function and outputs all code correctly to stdout or returns stderr in response

    return res.status(200).json({ success: "code ran successfully" });
  } catch (e) {
    return res.status(400).json({ success: false, error: String(e) });
  }

  //   console.log(eval);
});

app.post("/compile-test", (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;

  //*need vmname, comipler?, code, stdin?
  //* run fn
  //* prepare
  // *execute
  // *cb
  // console.log(code);

  let idx = Languages.findIndex((el) => el.lang === lang);
  console.log(idx);

  let DockCompiler = new DockerCompiler(
    code,
    Languages[idx].lang,
    Languages[idx].executor,
    Languages[idx].fileExt,
    Languages[idx].dockerImage
  );

  try {
    DockCompiler.run();

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false, error: e });
  }
});

app.listen(port, () => {
  console.log("server running");
});
