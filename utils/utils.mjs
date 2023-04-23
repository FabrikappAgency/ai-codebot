import fs from "fs";

/**
 * Writes data to a file asynchronously.
 * @param {string} path - The path of the file to write to.
 * @param {string} data - The data to write to the file.
 * @returns {Promise<boolean>} - A promise that resolves to true if the write was successful.
 */
async function writeFileContent(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, { encoding: "utf8" }, (err) => {
      if (err) {
        console.error("An error occurred while writing the file:", err);
        reject(err);
      } else {
        console.log("The file was saved!");
        resolve(true);
      }
    });
  });
}

/**
 * Reads data from a file asynchronously.
 * @param {string} path - The path of the file to read.
 * @returns {Promise<string>} - A promise that resolves to the data read from the file.
 */
async function getFileContent(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error("An error occurred while reading the file:", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Removes code output from a string.
 * @param {string} code - The string to remove code output from.
 * @returns {string} - The string with code output removed.
 */
function clearCodeOutput(code) {
  const regex = /```(?<word>\w+)?\n(?<content>[\s\S]*?)\n```/g;

  let result = "";
  let match;
  while ((match = regex.exec(code)) !== null) {
    const content = match.groups.content;
    result += content;
  }
  return result;
}

export { clearCodeOutput, getFileContent, writeFileContent };