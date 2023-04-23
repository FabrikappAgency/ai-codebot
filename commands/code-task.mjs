import fs from "fs";
import openai from "openai";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";
import chalk from "chalk";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

openai.apiKey = process.env.OPENAI_API_KEY;

async function codeTask(
  prompt = "no specific requirements",
  replaceCode = false
) {
  const contextFilePath = "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/prompts/agent.txt";
  const dataFilePath = "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  await clearMessages(dataFilePath);
  
  const context = await getFileContent(contextFilePath);

  const summary = await chatCompletion(prompt, context);
   
  console.log(chalk.green(`Changes : ${summary}`));

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
    fs.writeFile(path, data, "utf8", (err) => {
      if (err) reject(err);
      console.log("The file was saved!");
      resolve(true);
    });
  });
}

export { codeTask };