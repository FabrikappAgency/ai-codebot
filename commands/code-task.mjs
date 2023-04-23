import fs from "fs";
import openai from "openai";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";
import chalk from "chalk";
import { getFileContent } from "../utils/utils.mjs";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

openai.apiKey = process.env.OPENAI_API_KEY;

async function codeTask(
  prompt = "no specific requirements",
  replaceCode = false
) {
  const contextFilePath = "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/prompts/find_commands.txt";
  const dataFilePath = "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  await clearMessages(dataFilePath);
  console.log("clearMessages", contextFilePath);

  const context = await getFileContent(contextFilePath);
console.log("context", context);
  const summary = await chatCompletion(prompt, context);
   
  console.log(chalk.green(`Changes : ${summary}`));

  return summary;
}




export { codeTask };