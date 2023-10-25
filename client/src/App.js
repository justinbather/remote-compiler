import logo from "./logo.svg";
import "./App.css";
import MonacoEditor from "react-monaco-editor";

import data from "./test.txt";
import { useEffect, useState } from "react";

function App() {
  const [starterCode, setStarterCode] = useState("");
  const readFile = () => {
    const code = fetch(data)
      .then((d) => d.text())
      .then((text) => {
        setStarterCode(text);
      });
  };

  useEffect(() => {
    readFile();
  }, []);

  return (
    <div className="main">
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={starterCode}
      />
    </div>
  );
}

export default App;
