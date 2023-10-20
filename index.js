import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//* Temporarily uses local string var with javascript to simulate the ability to use JSON.stringify
//* Will need to look into converting to binary on the front end before sending
app.post("/js-test", (req, res) => {
  const data = req.body;

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

app.listen(port, () => {
  console.log("server running");
});
