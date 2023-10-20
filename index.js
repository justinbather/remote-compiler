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

app.post("/js-test", (req, res) => {
  const data = req.body;
  //   console.log(data);
  //   console.log(data);
  try {
    eval(data.code);
  } catch (e) {
    return res.status(400).json({ success: false, error: String(e) });
  }
  console.log(eval(data.code));
  //   console.log(eval);
  return res.status(200).json({ success: "not" });
});

app.listen(port, () => {
  console.log("server running");
});
