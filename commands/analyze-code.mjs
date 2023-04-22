import openai from "openai";
import fs from "fs";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
// console.log(openaiClient.instance);
// openaiClient.timeout = 30000; // sets timeout to 30 seconds
openai.apiKey = process.env.OPENAI_API_KEY;

async function analyzeCode(path) {
  const codeFilePath = `/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/${path}`;
  const dataFilePath =
  "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  //   const newMessage = "Hello, world!";
  await clearMessages(dataFilePath);
  // return 1;
  // Read the existing data from the file
  const code = await getFileContent(codeFilePath);
  const context = `You are the best software developer. You are a specialist. But you can only write code. Analyze this code and improve it. Your reply must contain the complete code and nothing else. Here is the code:${code}`;
  //   const context = "Start your reply with Hey Friend. You are a node software engineer. Analyze this code and send back the best way to improve it. You must send only the code, and the complete code of the page.";
  const summary = await chatCompletion( "Return a summary of the changes you've made in bullet point with return char.", context);
  console.log("summary", summary);
  
  const updatedCode = await chatCompletion("Apply this improvments to the code and return the code. You don't need to use enclosing quote or anything, just raw code.");
  console.log("updatedCode", updatedCode);
  await writeFileContent(codeFilePath, analyze);
  
  const analyze = await chatCompletion("Return a sentence giving your rating of this code.");
  console.log("analyze", analyze);
  
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
      resolve(true);
    });
  });
}

// ...

export { analyzeCode };
