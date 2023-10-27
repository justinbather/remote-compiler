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
    let start = performance.now();
    const cmd = `./docker.sh ${this.fileName} ${this.executor} ${this.dockerImage}`;

    //runs cmd with timeout, waiting for a success for error file to be written by the container to then return data in callback
    exec(cmd); //! Async

    const timeout = 5;
    let numberIntervals = 0;

    let timer = setInterval(() => {
      numberIntervals++;
      console.log(`Interval number: ${numberIntervals}`);

      fs.readFile("./temp/success.txt", "utf-8", (err, data) => {
        if (err && numberIntervals < timeout) {
          // console.log(err);
          //* No success.txt found, look for errors.txt
          fs.readFile("./temp/errors.txt", "utf-8", (err, data) => {
            if (err) {
              //* No error.txt found, keep going
              return;
            } else {
              //* Found error.txt, call the CB with error data read from file
              success(data); //error file found, return error info

              console.log("Found error file");
              exec("rm ./temp/errors.txt");
              console.log("error file deleted");
              let end = performance.now();
              console.log(`Request took ${end - start}ms`);
              clearInterval(timer);
              // return;
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
          // return;
        }
      });

      console.log(`completed ${numberIntervals} interval`);
    }, 1000); //1 seconds

    // exec(cmd, (error, stdout, stderr) => {
    //   let data = "";
    //   let errorData = "";
    //   let hints = ""; // In case there is no error or stdout we should make sure the user
    //   // knows to call the function in the code

    //   if (error) {
    //     //! Log error here
    //     console.log(error);
    //   }

    //   if (stderr) {
    //     errorData += stderr;
    //   }

    //   if (stdout) {
    //     data = stdout;
    //   } else if (!error && !stderr) {
    //     hints = "Make sure you call your function!";
    //   }

    //   success(data, errorData, hints);
    //   console.timeEnd();
    // });
  }
}
