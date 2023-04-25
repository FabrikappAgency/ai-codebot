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
import { execution_agent, chromaConnect } from "../babyagi/babyagi.js";

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

  const contextAnalyze = "You are the best software developer. You are a specialist. But you can only write code. Analyze this code and find ways improve it. Your reply must contain the improvements but not the original code.";
  const contextFixcode = "You are the best software developer. You are a specialist in nodejs an javascript/typescript. Your reply must contain only the modified and improved code.  ";

  /*  This add summary of the changes you've made in bullet point with return char. */
  /*
    const summary = await chatCompletion(
    "Return one sentence to describe the improvements you've just made."
  );
  console.log(chalk.green(`${summary}`)); 
  */
  const context = replaceCode === true ? contextFixcode : contextAnalyze;
  console.log(chalk.green(`${context}`));

  // let analyze = "analyze here";
  const fixcodePrompt = "Apply improvements that seems necessary to the code and return only the improved code. You can ask ChatGPT to output code within a code block by enclosing the code within triple backticks (```) like this: ```console.log('Hello World!');```";
  // Your code goes here
  const analyzePrompt =
    "Return a bullet point list of the improvments that can be applied. Separate each line with return char.";

  let summary = replaceCode === true ? fixcodePrompt : analyzePrompt;

  summary = summary.concat(
    prompt
      ? `You can update the code to implement only the following requirements: ${prompt}.`
      : ""
  ).concat(`Here is the code to update: ${code}`);

  const analyze = await chatCompletion(summary, context);
  if (replaceCode === true) {
    const formattedCode = clearCodeOutput(analyze);
    console.log(chalk.green(`Formatted : ${formattedCode}`));
    if (formattedCode !== "") {
      await writeFileContent(codeFilePath, formattedCode).catch((err) => {
        console.log("errorwriteFileContent", err);
      });
    }
  } 
  console.log(chalk.green(`Summary : ${summary}`));
  console.log(chalk.green(`Analyze : ${analyze}`));

  return { analyze, summary };
}
// analyzecode perpetual-cli.mjs send a details of this code
async function saveToChroma(task, result, path) {
  const randomString = () => Math.random().toString(36).substring(2, 8);
  const resultId = `result_${randomString()}`;
  const chromaCollection = await chromaConnect();

  const enrichedResult = { data: result }; // this is where you should enrich the result if needed

  const vector = enrichedResult.data;

  const add = await chromaCollection.add(
    [resultId],
    undefined,
    [{ path: path, task: task, result: result }],
    [vector]
  );
  console.log("collectionadd: ", add);
}

export { analyzeCode };
