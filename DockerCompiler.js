import fs from "fs";
import { exec } from "node:child_process";

export default class DockerCompiler {
  constructor(code) {
    this.code = code;
    // (this.timeout = timeout), vmName, stdin;
    // this.vmName = vmName;
    // this.stdin = stdin;
  }

  run() {
    // this.prepare(function () {
    //   this.execute(successCb);
    // });

    this.prepare();
  }

  prepare() {
    fs.writeFile("./temp/code.js", this.code, (err) => {
      if (err) {
        console.log("error writing to temp file, error: ", err);
      } else {
        console.log("File written successfully");
        this.execute();
      }
    });

    //*create file and copy code to it before executing
  }

  execute() {
    //* with use of fs and child_process.exec()
    //* exec can be called with a promise or a cb
    //* after spawning a shell and booting a docker container we run the
    //* sanitized command in to run the code
    //* return stdin, stdout, stderr
    exec("node ./temp/code.js");
  }
}
