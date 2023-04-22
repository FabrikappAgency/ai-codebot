import { exec } from "child_process";

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command ?? "ls", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout)
    });
  });
}
export { runCommand };
