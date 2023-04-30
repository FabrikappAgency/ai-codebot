// import { exec, spawn } from "child_process";
// import { PassThrough } from "stream";

// /**
//  * Executes a command in the shell and returns the output as a string.
//  * @param {string} command - The command to run in the shell.
//  * @param {string} path - The path where to execute the command.
//  * @returns {Promise<string>} - The output of the command as a string.
//  */

// async function runCommand(command: string, path = ""): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const child = exec(command || "ls", { cwd: path });
//     const outputStream = new PassThrough();
//     const errorStream = new PassThrough();

//     child.stdout.pipe(outputStream);
//     child.stderr.pipe(errorStream);

//     const outputChunks: string[] = [];
//     const errorChunks: string[] = [];

//     child.stdout.on("data", (chunk) => {
//       process.stdout.write(chunk);
//       outputChunks.push(chunk.toString());
//     });

//     child.stderr.on("data", (chunk) => {
//       process.stderr.write(chunk);
//       errorChunks.push(chunk.toString());
//     });

//     child.on("error", (error) => {
//       console.error(`Error: ${error.message}`);
//       reject(error.message);
//     });

//     child.on("exit", (code) => {
//       if (code === 0) {
//         resolve(outputChunks.join(""));
//       } else {
//         const errorMessage = errorChunks.join("");
//         console.error(`Stderr: ${errorMessage}`);
//         reject(errorMessage);
//       }
//     });

//     // For some commands, we need to answer "yes" or "no". We can use this to automatically answer "yes"
//     child.stdin.write("y\n");
//     child.stdin.end();
//   });
// }

// export { runCommand };