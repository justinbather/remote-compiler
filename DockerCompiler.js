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
  run(success) {
    this.prepare(success);
  }

  //* Prepares the files to be ran
  //* Writes user's code to a new file in /temp to be copied into the docker instance
  prepare(success) {
    fs.writeFile(`./temp/${this.fileName}`, this.code, (err) => {
      if (err) {
        console.log("error writing to temp file, error: ", err);
      } else {
        console.log("File written successfully");
        this.execute(success);
      }
    });
  }

  //* This gets executed by child process which runs the bash script docker.sh
  //* Docker.sh creates a container with the user's code to be ran by providing the file extension and executing cmd below
  execute(success) {
    //! Implement a timeout
    //? In bash script?
    console.time();
    const cmd = `./docker.sh ${this.fileName} ${this.executor} ${this.dockerImage}`;

    exec(cmd, (error, stdout, stderr) => {
      let data = "";
      let errorData = "";
      let hints = ""; // In case there is no error or stdout we should make sure the user
      // knows to call the function in the code

      if (error) {
        //! Log error here
        console.log(error);
      }

      if (stderr) {
        errorData += stderr;
      }

      if (stdout) {
        data = stdout;
      } else if (!error && !stderr) {
        hints = "Make sure you call your function!";
      }

      success(data, errorData, hints);
      console.timeEnd();
    });
  }
}
