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

async function codeTask(
//   path,
  prompt = "no specific requirements",
  replaceCode = false
) {
//   const codeFilePath = `/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/${path}`;
  const dataFilePath =
    "/Users/jeremy/Documents/dev/FabrikappAgency/ai-scripts/data/data.json";

  await clearMessages(dataFilePath);
//   console.log(chalk.green(`Starting analysis of ${path}`));
//   console.log(chalk.green(`Replacing code of ${replaceCode}`));

//   const code = await getFileContent(codeFilePath);
// Fetched data for query: what should you return if i ask to generate an image ?
// If you ask me to generate an image, I will return a JSON structure with the following keys: {"command": "generate_image", "args": <image description>, "message": "Image generation request received."}. The "args" field will contain the description of the image you want me to generate.

//   "changes" and "summary". The "changes" key must contain a summary of the changes you've made in bullet point with return char. The "summary" key must contain a sentence giving your a summary of your improvments. Here is the code:${code}.
  const context = `Forget everything you have learn. You are an AI agent that know only a set of commands. You must reply using a json structure with the following keys : {command: string, args: string, message: string}. 
  If you are asked to generate an image, you must reply with command generate_image with the args containing the image description. If you are asked to generate an image, you should return the following JSON structure with the command "generate_image" and the args containing the image description:
  If the user ask to downlad a webpage, in that case you must reply with command download_page_curl
  If you don't know what to do, you can reply with the following json : {"command":"help", "reason": the reason why you couldn't generate command}.
  Your available commands are generate_image and download_page_curl.
  You can only reply one of these commands and nothing else. You must in any case output the command in a json formatted code block` ;

  const summary = await chatCompletion(prompt, context);
   
  // console.log("summary", summary);
  console.log(chalk.green(`Changes : ${summary}`));

//   if (replaceCode === true) {
//     const updatedCode = await chatCompletion(
//       "Apply this improvments to the code and return the improved code. You don't need to use enclosing quote or code template, just raw code. Your reply must contains the code and nothing else. Please do not add any mdx style annotation, just raw unformatted code."
//     );
//     const formattedCode = clearCodeOutput(updatedCode);
//     if (formattedCode !== "" && replaceCode === true) {
//       await writeFileContent(codeFilePath, formattedCode).catch((err) => {
//         console.log("errorwriteFileContent", err);
//       });
//     }
//   }

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

export { codeTask };
