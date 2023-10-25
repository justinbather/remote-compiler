import logo from "./logo.svg";
import "./App.css";
import MonacoEditor from "react-monaco-editor";

function App() {
  return (
    <>
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
      />
    </>
  );
}

export default App;
