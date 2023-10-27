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

  //* Prepares the files to be run
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

  execute(success) {
    console.time();
    let start = performance.now();

    let testId = "1"; //! temp var for test id to be given to script

    //* This command gets ran to start docker and compilation process
    const cmd = `./docker.sh ${this.fileName} ${this.executor} ${this.dockerImage} ${testId}`;

    exec(cmd); //! Async

    const timeout = 5;
    let numberIntervals = 0;

    let timer = setInterval(() => {
      numberIntervals++;
      console.log(`Interval number: ${numberIntervals}`);

      fs.readFile("./temp/success.txt", "utf-8", (err, data) => {
        if (err && numberIntervals < timeout) {
          //* No success.txt found, look for errors.txt

          fs.readFile("./temp/errors.txt", "utf-8", (err, data) => {
            if (err) {
              //* No error.txt found, keep going
              return;
            } else {
              //* Found error.txt, call the CB with error data read from file
              success(data);

              console.log("Found error file");
              exec("rm ./temp/errors.txt");
              console.log("error file deleted");

              let end = performance.now();
              console.log(`Request took ${end - start}ms`);

              clearInterval(timer);
            }
          });

          return;
        } else if (err && numberIntervals >= timeout) {
          //* Timeout is up, return timeout error

          console.log("Request timed out. Time limit exceeded");
          success("Compilation Timeout Occured: Timelimit exceeded.");
          clearInterval(timer);
        } else if (data) {
          //* found success.txt, return the file data to CB
          success("", data, "");
          console.log("Found success file");
          exec("rm ./temp/success.txt");
          console.log("success file deleted");

          let end = performance.now();
          console.log(`Request took ${end - start}ms`);

          clearInterval(timer);
        }
      });

      console.log(`completed ${numberIntervals} interval`);
    }, 1000); //1 second intervals
  }
}
