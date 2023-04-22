import fs from "fs";
import openai from "openai";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

openai.apiKey = process.env.OPENAI_API_KEY;

async function analyzeCode(path) {
  const codeFilePath = `/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/${path}`;
  const dataFilePath = "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  await clearMessages(dataFilePath);

  const code = await getFileContent(codeFilePath);
  const context = `You are the best software developer. You are a specialist. But you can only write code. Analyze this code and improve it. Your reply must contain the complete code and nothing else. Here is the code:${code}`;

  const summary = await chatCompletion("Return a summary of the changes you've made in bullet point with return char.", context);
  const analyze = await chatCompletion("Return a sentence giving your a summary of your improvments..");

  console.log("summary", summary);
  console.log("analyze", analyze);

  return summary;
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

async function writeFileContent(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(path, data, "utf8", (err) => {
      if (err) reject(err);
      console.log("The file was saved!");
      resolve(true);
    });
  });
}

export { analyzeCode };
