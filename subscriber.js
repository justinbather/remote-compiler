import amqp from "amqplib/callback_api.js";
import axios from "axios";
import DockerCompiler from "./DockerCompiler.js";
import { languages } from "./languages.js";

export const subscribe = async () => {
  amqp.connect("amqp://127.0.0.1", function (error, connection) {
    if (error) {
      throw error;
    }

    connection.createChannel(function (error, channel) {
      if (error) {
        throw error;
      }
      let queue = "test-q";

      channel.assertQueue(queue, {
        durable: false,
      });

      console.log("Waiting for message");

      channel.consume(
        queue,
        function (msg) {
          console.log(typeof msg);

          const data = JSON.parse(msg.content);
          console.log(data.problem);
          let idx = languages.findIndex(
            (el) => el.lang === data.problem.language
          );

          let DockCompiler = new DockerCompiler(
            data.jobId,
            data.code,
            languages[idx].lang,
            languages[idx].executor,
            languages[idx].fileExt,
            languages[idx].dockerImage,
            data.problem.filePrefix,
            data.problem.inputCode,
            data.problem.output,
            data.problem.callerCode
          );

          DockCompiler.run(function (stdout, error, success) {
            if (success) {
              console.log("success, patching to manager");
              axios
                .patch("http://localhost:7070/compile", {
                  jobId: DockCompiler.jobId,
                  update: { status: "completed", output: stdout },
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.error(
                    "error caught sending patch to manager service",
                    err
                  );
                });
            } else {
              axios
                .patch("http://localhost:7070/compile", {
                  jobId: DockCompiler.jobId,
                  update: { status: "failed", output: error },
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.error(
                    "error caught sending patch to manager service",
                    err
                  );
                });
            }
          });
        },
        {
          noAck: true,
        }
      );
    });
  });
};
