import fs from "fs";
import { exec } from "node:child_process";

export default class DockerCompiler {
  constructor(code, lang, executor, fileExt, dockerImage) {
    this.code = code;
    this.lang = lang;
    this.executor = executor;
    this.fileExt = fileExt;
    this.dockerImage = dockerImage;
    this.fileName = `code${this.fileExt}`;
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
    fs.writeFile(`./temp/${this.fileName}`, this.code, (err) => {
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

    const cmd = `./docker.sh ${this.fileName} ${this.executor} ${this.dockerImage}`;

    const python =
      "docker run -i --rm --name test-container -v /temp -w /temp python:3 python3 code.py > temp/output.txt";
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        fs.writeFile("./temp/output.txt", stderr, (err) => {
          console.log("error occured writing output", err);
        });
      }
      console.log("stdout: ", stdout);
      fs.writeFile("./temp/output.txt", stdout, (err) => {
        console.log("error occured writing output", err);
      });
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
