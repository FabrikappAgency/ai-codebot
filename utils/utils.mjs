import fs from "fs";

async function writeFileContent(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, "utf8", (err) => {
      if (err) reject(err);
      console.log("The file was saved!");
      resolve(true);
    });
  });
}

async function getFileContent(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function clearCodeOutput(code) {
  const regex = /```(?<word>\w+)?\n(?<content>[\s\S]*?)\n```/gm;

  try {
    let match;
    while ((match = regex.exec(code)) !== null) {
      const content = match.groups.content;
      console.log(content);
      return content;
    }
    return "";
  } catch (error) {
    console.error("An error occurred while clearing code output:", error);
    return "";
  }
}


export { clearCodeOutput, getFileContent, writeFileContent}
