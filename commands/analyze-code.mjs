import fs from "fs";
import openai from "openai";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import { chatCompletion, clearMessages } from "./index.mjs";
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
  console.log(chalk.green(`Replacing code of ${replaceCode}`));

  const code = await getFileContent(codeFilePath);

  const context = `You are the best software developer. You are a specialist. But you can only write code. Analyze this code and improve it. Your reply must contain the complete code and nothing else. Here is the code:${code}. `;

  const summary = await chatCompletion(
    "Return a summary of the changes you've made in bullet point with return char." .concat(prompt ? `You can update the code to implement the following requirements:${prompt}` : ""),
    context
  );

  // console.log("summary", summary);
  console.log(chalk.green(`Changes : ${summary}`));

  if (replaceCode === true) {
    const updatedCode = await chatCompletion(
      "Apply this improvments to the code and return the improved code. You don't need to use enclosing quote or code template, just raw code. Your reply must contains the code and nothing else. Please do not add any mdx style annotation, just raw unformatted code."
    );
    const formattedCode = clearCodeOutput(updatedCode);
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

async function writeFileContent(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, "utf8", (err) => {
      if (err) reject(err);
      console.log("The file was saved!");
      resolve(true);
    });
  });
}

export { analyzeCode };
