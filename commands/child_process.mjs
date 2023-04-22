import { exec } from "child_process";

/**
 * Executes a command in the shell and returns the output as a string.
 * @param {string} command - The command to run in the shell.
 * @returns {Promise<string>} - The output of the command as a string.
 */
async function runCommand(command) {
  try {
    const { stdout, stderr } = await exec(command || "ls");
    if (stderr) console.log(`Stderr: ${stderr}`);
    return stdout.trim();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
}

export { runCommand };
