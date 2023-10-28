import fs from "fs";
import { exec } from "node:child_process";

/**
 * DockerCompiler is a class that facilitates running user-submitted code within a Docker container.
 *
 * @class DockerCompiler
 */

export default class DockerCompiler {
  /**
   * Creates an instance of DockerCompiler.
   *
   * @constructor
   * @param {string} code - The user's code to be executed.
   * @param {string} lang - The programming language of the code.
   * @param {string} executor - The executor or compiler for the code (e.g., "node").
   * @param {string} fileExt - The file extension of the code file (e.g., ".js").
   * @param {string} dockerImage - The Docker image to run the code.
   */

  constructor(code, lang, executor, fileExt, dockerImage) {
    this.code = code;
    this.lang = lang;
    this.executor = executor;
    this.fileExt = fileExt;
    this.dockerImage = dockerImage;
    this.fileName = `code${this.fileExt}`;
  }

  /**
   * Runs the DockerCompiler build process to execute the user's code.
   *
   * @param {function} success - The callback function to handle the result of code execution.
   */
  run(success) {
    this.prepare(success);
  }

  /**
   * Prepares the files for execution.
   *
   * @param {function} success - The callback function to handle the result of code execution.
   */

  prepare(success) {
    // ! Temporary file name
    //! Format: test_id.file_ext
    const testId = 1;
    const fileName = testId + ".js";
    console.log(fileName);

    fs.copyFileSync(`./tests/${fileName}`, `./tests/test.js`);

    fs.appendFileSync(`./tests/test.js`, this.code);

    console.log("File written successfully");

    this.execute(success);
  }

  /**
   * Executes the user's code within a Docker container and handles the result.
   *
   * @param {function} success - The callback function to handle the result of code execution.
   */

  execute(success) {
    const fileName = "test.js"; //! Temp
    console.time();
    let start = performance.now();

    let testId = "1"; //! temp var for test id to be given to script

    // Command to start Docker and the compilation process
    const cmd = `./docker.sh test.js ${this.executor} ${this.dockerImage} ${testId}`;

    exec(cmd); //! Async

    const timeout = 5;
    let numberIntervals = 0;

    let timer = setInterval(() => {
      numberIntervals++;
      console.log(`Interval number: ${numberIntervals}`);

      fs.readFile("./temp/success.txt", "utf-8", (err, data) => {
        if (err && numberIntervals < timeout) {
          //* No success.txt found, look for errors.txt

          fs.readFile("./temp/stderr.log", "utf-8", (err, data) => {
            if (err) {
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
            } else {
              success(data);

              console.log("Found stderr.log, compilation error in user code");
              exec("rm ./temp/stderr.log");

              clearInterval(timer);
              return;
            }
          });
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
          // console.log(`Request took ${end - start}ms`);

          clearInterval(timer);
        }
      });

      console.log(`completed ${numberIntervals} interval`);
    }, 1000); //Max 5, 1 second intervals
  }
}
