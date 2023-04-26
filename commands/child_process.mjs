import { spawn } from "child_process";

/**
 * Executes a command in the shell with the given arguments and returns the output as a string.
 * @param {string} command - The command to run in the shell.
 * @param {string[]} args - The arguments to pass to the command.
 * @param {string} path - The path where to execute the command.
 * @param {boolean} interactive - Whether or not the command requires interactive input.
 * @returns {Promise<string>} - The output of the command as a string.
 */
async function runCommand(command, args = [], path = "", interactive = false) {
  return new Promise((resolve, reject) => {
    try {
      const options = { cwd: path, shell: true };
      if (interactive) {
        options["stdio"] = "inherit";
      }
      const child = spawn(command, args, options);

      let stdout = "";
      let stderr = "";

      // if (child && child.stdout && typeof child.stdout.on === 'function') {
      //   stdout += data;
      // });

      // child.stderr.on("data", (data) => {
      //   stderr += data;
      // });

      child.on("close", (code) => {
        if (code === 0) {
          console.log(stdout);
          resolve(stdout);
        } else {
          const errorMessage =
            stderr || `Error: command exited with code ${code}`;
          console.error(errorMessage);
          reject(errorMessage);
        }
      });

      child.on("error", (error) => {
        console.error(`Error: ${error.message}`);
        reject(error.message);
      });

      // if (interactive) {
      //   child.stdin.write("y\n");
      // }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      reject(error.message);
    }
  });
}

export { runCommand };
