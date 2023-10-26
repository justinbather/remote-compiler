import data from "../utils/starter_code.txt";
import { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";

export const CodeEditor = () => {
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const readFile = () => {
    const code = fetch(data)
      .then((d) => d.text())
      .then((text) => {
        setUserCode(text);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/compile-test",
        {
          code: userCode,
          lang: "Javascript",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      console.log(response.data);
      setOutput(response.data.output);
    } catch (err) {
      console.error("error occured sending request to compile -> ", err);
    }
  };

  const handleChange = (e) => {
    setUserCode(e);
  };

  useEffect(() => {
    //Load starter code on render
    readFile();
  }, []);

  return (
    <div className="main">
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={userCode}
        onChange={handleChange}
      />
      <button className="compile-btn" onClick={handleSubmit}>
        Compile
      </button>
      <div className="output">
        <h3 className="output-label">Output: </h3>
        <h3 className="output-response">{output}</h3>
      </div>
    </div>
  );
};
