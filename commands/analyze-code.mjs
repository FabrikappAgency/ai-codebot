import fs from "fs";
import openai from "openai";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";
import { getFileContent, writeFileContent, clearCodeOutput } from "../utils/utils.mjs";

import chalk from "chalk";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

openai.apiKey = process.env.OPENAI_API_KEY;

async function analyzeCode(
  path,
  prompt = "no specific requirements",
  replaceCode = false
) {
  const codeFilePath = `/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/${path}`;
  const dataFilePath =
    "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  await clearMessages(dataFilePath);
  console.log(chalk.green(`Starting analysis of ${path}`));
  console.log(chalk.green(`Replacing code : ${replaceCode}`));

  const code = await getFileContent(codeFilePath);

  const context = `You are the best software developer. You are a specialist. But you can only write code. Analyze this code and improve it. Your reply must contain the complete code and nothing else. Here is the code:${code}. `;

  const summary = await chatCompletion(
    "Return a summary of the changes you've made in bullet point with return char.".concat(
      prompt
        ? `You can update the code to implement the following requirements:${prompt}`
        : ""
    ),
    context
  );

  // console.log("summary", summary);
  console.log(chalk.green(`Changes : ${summary}`));

  if (replaceCode === true) {
    const updatedCode = await chatCompletion(
      `Apply this improvments to the code and return the improved code. You don't need to use enclosing quote or code template, just raw code. Your reply must contains the code and nothing else. Please do not add any mdx style annotation, just raw unformatted code. Improvments : ${summary}`
    );
    const formattedCode = clearCodeOutput(updatedCode);
    console.log(chalk.green(`formattedCode : ${formattedCode}`));
    if (formattedCode !== "" && replaceCode === true) {
      await writeFileContent(codeFilePath, formattedCode).catch((err) => {
        console.log("errorwriteFileContent", err);
      });
    }
  }

  // const analyze = await chatCompletion(
  //   "Return a sentence giving your a summary of your improvments."
  // );
  // console.log(chalk.green(`Summary : ${analyze}`));

  // console.log("analyze", analyze);

  return summary;
}
export { analyzeCode };
