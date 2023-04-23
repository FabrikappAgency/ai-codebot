import { exec } from "child_process";

/**
 * Executes a command in the shell and returns the output as a string.
 * @param {string} command - The command to run in the shell.
 * @returns {Promise<string>} - The output of the command as a string.
 */

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command || "ls", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message);
        // return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        // return;
        reject(stderr);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}
export { runCommand };
