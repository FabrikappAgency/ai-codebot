import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import openaiPackage from "@tectalic/openai";
import chalk from "chalk";
import { getFileContent, extractCodeBlocks } from "../utils/utils.mjs";
import { chatCompletion, clearMessages, analyzeSummary } from "./index.mjs";
import { runCommand } from "./child_process.mjs";
import { execution_agent, chromaConnect } from "../babyagi/babyagi.js";

dotenv.config();
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);

const contextFilePath = process.env.CONTEXT_FILE_PATH;
const dataFilePath = process.env.DATA_FILE_PATH;
const projectPath = `${process.env.PROJECT_ROOT}/generated`;

async function clearData() {
  await clearMessages(dataFilePath);
  console.log("Cleared messages from", dataFilePath);
}

async function cliTask(objective, task) {
  await clearData();
  const chromaCollection = await chromaConnect();
  const result = await execution_agent(objective, task, chromaCollection);

  const commands = JSON.parse(result).commands;
  console.log(chalk.green(`Analyze : ${commands.length}`, commands));
  //   const blocks = extractCodeBlocks(analyze);
  //   console.log(chalk.green(`Blocks : ${blocks.length}`, blocks));
  const randomProjetPath = `${projectPath}/${Math.random()
    .toString(36)
    .substring(7)}`;

  const cmd = "touch";
  const args = ["README.md"];
  console.log("cmd is : ", cmd);

  try {
    await runCommand("mkdir", [`-p`, `${randomProjetPath}`]);
    await runCommand(cmd, args, randomProjetPath, true);
    //   await runCommand(`cd ${randomProjetPath} && ls -la`);
    for (const command of commands) {
      console.log("command", command);
      const words = command.split(" ");
      let cmd = words[0];
    //   if (words[0].startsWith("npm")) {
    //     words[0];
    //   }
      words.shift();
      const args = words;
      runCommand(cmd, args, randomProjetPath);
    }
    return result;
  } catch (error) {
    console.log("errorRunCommand", error);
  }
}

export { cliTask };
