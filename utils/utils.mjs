import fs from "fs";

/**
 * Writes data to a file asynchronously.
 * @param {string} path - The path of the file to write to.
 * @param {string} data - The data to write to the file.
 * @returns {Promise<boolean>} - A promise that resolves to true if the write was successful.
 * @throws Will throw an error if the write operation fails.
 */
async function writeFileContent(path, data) {
  try {
    await fs.promises.writeFile(path, data, { encoding: "utf8" });
    console.log("The file was saved!");
    return true;
  } catch (err) {
    console.error("An error occurred while writing the file:", err);
    throw err;
  }
}

/**
 * Reads data from a file asynchronously.
 * @param {string} path - The path of the file to read.
 * @returns {Promise<string>} - A promise that resolves to the data read from the file.
 * @throws Will throw an error if the read operation fails.
 */
async function getFileContent(path) {
  try {
    const data = await fs.promises.readFile(path, "utf8");
    return data;
  } catch (err) {
    console.error("An error occurred while reading the file:", err);
    throw err;
  }
}
/**
 * Extracts code blocks from a string.
 * @param {string} code - The string to extract code blocks from.
 * @returns {string[]} - An array of code blocks.
 * @throws Will throw an error if the regular expression fails to match.
 */
function extractCodeBlocks(code) {
  try {
    const regex = /```(?<word>\w+)?\n(?<content>[\s\S]*?)\n```/g;

    let result = [];
    let match;
    while ((match = regex.exec(code)) !== null) {
      const content = match.groups.content;
      result.push(content);
    }
    return result;
  } catch (err) {
    console.error("An error occurred while extracting the code blocks:", err);
    throw err;
  }
}
/**
 * Removes code output from a string.
 * @param {string} code - The string to remove code output from.
 * @returns {string} - The string with code output removed.
 * @throws Will throw an error if the regular expression fails to match.
 */
function clearCodeOutput(code) {
  try {
    const regex = /```(?<word>\w+)?\n(?<content>[\s\S]*?)\n```/g;

    let result = "";
    let match;
    while ((match = regex.exec(code)) !== null) {
      const content = match.groups.content;
      result += content;
    }
    return result;
  } catch (err) {
    console.error("An error occurred while clearing the code output:", err);
    throw err;
  }
}

export { clearCodeOutput, getFileContent, writeFileContent, extractCodeBlocks };