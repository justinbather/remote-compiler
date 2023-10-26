import data from "../utils/starter_code.txt";
import mock from "../utils/mock_test.txt";
import { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";

export const CodeEditor = () => {
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [hints, setHints] = useState("");
  const [result, setResult] = useState("");
  const [mockTest, setMockTest] = useState("");

  const readFile = () => {
    const code = fetch(data)
      .then((d) => d.text())
      .then((text) => {
        setUserCode(text);
      });
  };

  const readMock = () => {
    const mockData = fetch(mock)
      .then((i) => i.text())
      .then((text) => {
        setMockTest(text);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/compile-test",
        {
          code: userCode,
          lang: "Python",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      console.log(response.data);
      setOutput(response.data.output);
      setErrors(response.data.errors);
      setHints(response.data.hints);
      setResult(String(response.data.success));
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
    readMock();
  }, []);

  return (
    <div className="main">
      <MonacoEditor
        width="800"
        height="600"
        language="python"
        theme="vs-dark"
        value={userCode}
        onChange={handleChange}
      />
      <button className="compile-btn" onClick={handleSubmit}>
        Compile
      </button>
      <div className="output">
        <div className="output-row">
          <h3 className="output-label">Output: </h3>
          <h3 className="output-response">{output}</h3>
        </div>
        <div className="output-row">
          <h3 className="output-label">Test Result: </h3>
          <h3 className="output-response">{result}</h3>
        </div>
        <div className="output-row">
          <h3 className="output-label">Test Case: </h3>
          <h3 className="output-response">{mockTest}</h3>
        </div>
        <div className="output-row">
          <h3 className="output-label">Test Result: </h3>
          <h3 className="output-response">{result}</h3>
        </div>
        <div className="output-row">
          <h3 className="output-label">Errors: </h3>
          <h3 className="output-response">{errors}</h3>
        </div>
        <div className="output-row">
          <h3 className="output-label">Hints: </h3>
          <h3 className="output-response">{hints}</h3>
        </div>
      </div>
    </div>
  );
};
