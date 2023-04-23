import fs from "fs";
import inquirer from "inquirer";
import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import { chatCompletion, clearMessages } from "./index.mjs";
import {
  getFileContent,
  writeFileContent,
  clearCodeOutput,
} from "../utils/utils.mjs";

dotenv.config();

async function analyzeCode(
  path,
  prompt = "no specific requirements",
  replaceCode = false
) {
  const codeFilePath = `${process.env.PROJECT_ROOT}/${path}`;
  const dataFilePath = "./data/data.json";

  await clearMessages(dataFilePath);

  const code = await getFileContent(codeFilePath);

  const context = `You are the best software developer. You are a specialist. But you can only write code. Analyze this code and find ways improve it. Your reply must contain the improvements but not the original code. Here is the code:${code}. `;

  const analyze = await chatCompletion(
    "Return a summary of the changes you've made in bullet point with return char.".concat(
      prompt
        ? `You can update the code to implement only the following requirements:${prompt}`
        : ""
    ),
    context
  );
  console.log(chalk.green(`${analyze}`));

  /*  This add summary of the changes you've made in bullet point with return char. */
  /*
    const summary = await chatCompletion(
    "Return one sentence to describe the improvements you've just made."
  );
  console.log(chalk.green(`${summary}`)); 
  */
  if (replaceCode === true) {
    const updatedCode = await chatCompletion(
      `Apply this improvements to the code and return only the improved code. You don't need to use enclosing quote or code template, just raw code. Your reply must contain the code and nothing else. Please do not add any mdx style annotation, just raw unformatted code.`
    );
    const formattedCode = clearCodeOutput(updatedCode);
    if (formattedCode !== "" && replaceCode === true) {
      await writeFileContent(codeFilePath, formattedCode).catch((err) => {
        console.log("errorwriteFileContent", err);
      });
    }
  }

  const summary = "summary here";
  return { analyze, summary };
}

export { analyzeCode };
