import openai from "openai";
import fs from "fs";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();
import openaiPackage from "@tectalic/openai";
import { chatCompletion } from "./index.mjs";
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
// console.log(openaiClient.instance);
// openaiClient.timeout = 30000; // sets timeout to 30 seconds
openai.apiKey = process.env.OPENAI_API_KEY;

async function analyzeCode(path) {
  const dataFilePath = `/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/${path}`;
  //   const newMessage = "Hello, world!";

  // Read the existing data from the file
  const data = await getFileContent(dataFilePath);
  const context =
    `You are the best software developer. You are a specialist. But you cannot express yourself, only write code. Analyze this code and send back the best way to improve it. Your reply must contain the complete code and nothing else. Here is the code:${data}`;
  //   const context = "Start your reply with Hey Friend. You are a node software engineer. Analyze this code and send back the best way to improve it. You must send only the code, and the complete code of the page.";
  const analyze = await chatCompletion("Send me the optimized code.", context);
  const summary = await chatCompletion("Return a summary of the changes you've made in bullet point with return char.");
  //   console.log(data);
  await writeFileContent(dataFilePath, analyze);
  return summary;
}

async function getFileContent(path) {
  return new Promise((resolve, reject) => {
    // Read the contents of the JSON file
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);

      console.log(data);
      resolve(data);
    });
  });
}
async function writeFileContent(path, data) {
  return new Promise((resolve, reject) => {
    // Read the contents of the JSON file
    fs.writeFileSync(path, data, "utf8", (err) => {
      if (err) throw err;
      console.log("The file was saved!");
      resolve();
    });
  });
}

// ...

export { analyzeCode };
