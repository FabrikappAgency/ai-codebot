import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import chalk from "chalk";
import { getFileContent, clearCodeOutput } from "../utils/utils.mjs";
import { chatCompletion, clearMessages } from "./index.mjs";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

const contextFilePath = process.env.CONTEXT_FILE_PATH;
const dataFilePath = process.env.DATA_FILE_PATH;

async function clearData() {
  await clearMessages(dataFilePath);
  console.log("Cleared messages from", dataFilePath);
}

async function analyzeSummary(summary) {
  try {
    const json = JSON.parse(summary);
    if (json.hasOwnProperty("command")) {
      console.log(chalk.green("Valid JSON with 'command' key detected"));
      return true;
    } else {
      console.log(chalk.red("JSON does not have 'command' key"));
      return false;
    }
  } catch (err) {
    console.log(chalk.red("Invalid JSON"));
    return false;
  }
}

async function codeTask(
  prompt = "no specific requirements",
  replaceCode = false
) {
  await clearData();
  const context = await getFileContent(contextFilePath);
  const analyze = await chatCompletion(prompt, context);
  console.log(chalk.green(`Analyze : ${analyze}`));
  const isAnalyzeValid = await analyzeSummary(analyze);
  if (isAnalyzeValid) {
    return analyze;
  } else {
    const formattedAnalyze = clearCodeOutput(analyze);
    //   console.log(chalk.green(`Changes : ${summary}`));
    const isValid = await analyzeSummary(formattedAnalyze);
    return isValid ? formattedAnalyze : "";
  }
}

export { codeTask };
