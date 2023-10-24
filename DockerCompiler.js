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
    fs.writeFile("./temp/code.py", this.code, (err) => {
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
    //* Need to now create a bash script that spawns a docker container and runs the below command

    const cmd = "./docker.sh";

    const python =
      "docker run -i --rm --name test-container -v /temp -w /temp python:3 python3 code.py > temp/output.txt";
    exec(cmd, (error, stdout, stdin) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("stdout: ", stdout);
    });

    // exec("node ./temp/code.js", (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(error);
    //   }

    //   console.log("stdout: ", stdout);
    //   console.log("stderr: ", stderr);
    // });
  }
}
