import { exec } from "child_process";

/**
 * Executes a command in the shell and returns the output as a string.
 * @param {string} command - The command to run in the shell.
 * @param {string} path - The path where to execute the command.
 * @returns {Promise<string>} - The output of the command as a string.
 */

async function runCommand(command, path = "") {
  return new Promise((resolve, reject) => {
    exec(command || "ls", { cwd: path }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        reject(stderr);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

export { runCommand };