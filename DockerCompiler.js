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
  }

  //* Runs the DockerCompiler build process to run a user's code upon submission
  run() {
    this.prepare();
  }

  //* Prepares the files to be ran
  //* Writes user's code to a new file in /temp to be copied into the docker instance
  prepare() {
    fs.writeFile(`./temp/${this.fileName}`, this.code, (err) => {
      if (err) {
        console.log("error writing to temp file, error: ", err);
      } else {
        console.log("File written successfully");
        this.execute();
      }
    });
  }

  //* This gets executed by child process which runs the bash script docker.sh
  //* Docker.sh creates a container with the user's code to be ran by providing the file extension and executing cmd below
  execute() {
    const cmd = `./docker.sh ${this.fileName} ${this.executor} ${this.dockerImage}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        fs.writeFile("./temp/output.txt", stderr, (err) => {
          if (err) {
            console.log("error occured writing output", err);
          }
        });
      }
      console.log("stdout: ", stdout);
      fs.writeFile("./temp/output.txt", stdout, (err) => {
        if (err) {
          console.log("error occured writing output", err);
        }
      });
    });
  }
}
