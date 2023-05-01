import dotenv from 'dotenv';
import chalk from 'chalk';
import {
  getFileContent,
  writeFileContent,
  clearCodeOutput,
  clearMessages,
} from '../utils/index.js';
import AppConfig from '../config/config.js';
import { chatCompletion } from './index.js';
// import { chromaConnect } from '../babyagi/babyagi.js';

dotenv.config();

interface AnalyzeResult {
  analyze: string;
  summary: string;
}

async function analyzeCode(
  path: string,
  prompt: string,
  replaceCode: boolean,
): Promise<AnalyzeResult> {
  const codeFilePath = `${AppConfig.projectRootPath}/${path}`;

  await clearMessages();

  const code = await getFileContent(codeFilePath);

  const contextAnalyze =
    'You are the best software developer. You are a specialist. But you can only write code. Analyze this code and find ways improve it. Your reply must contain the improvements but not the original code.';
  const contextFixcode =
    'You are the best software developer. You are a specialist in nodejs an javascript/typescript. Your reply must contain only the modified and improved code.  ';

  const context = replaceCode === true ? contextFixcode : contextAnalyze;
  // console.log(chalk.green(`${context}`));

  const fixcodePrompt =
    "Apply improvements that seems necessary to the code and return only the improved code. You must output the updated code within a code block by enclosing the code within triple backticks (```) like this: ```console.log('Hello World!');```";
  const analyzePrompt =
    'Return a bullet point list of the improvments that can be applied. Separate each line with return char.';

  let summary = replaceCode === true ? fixcodePrompt : analyzePrompt;

  summary = summary
    .concat(
      prompt
        ? `You can update the code to implement only the following requirements: ${prompt}.`
        : '',
    )
    .concat(`Here is the code to update: ${code}`);

  const analyze = await chatCompletion(summary, context);
  if (replaceCode === true) {
    const formattedCode = clearCodeOutput(analyze);
    console.log(chalk.green(`Formatted : ${formattedCode}`));
    if (formattedCode !== '') {
      await writeFileContent(codeFilePath, formattedCode).catch((err) => {
        console.log('errorwriteFileContent', err);
      });
    }
  }
  console.log(chalk.green(`Summary : ${summary}`));
  console.log(chalk.green(`Analyze : ${analyze}`));

  return { analyze, summary };
}

async function saveToChroma(task: string, result: string, path: string) {
  const randomString = () => Math.random().toString(36).substring(2, 8);
  const resultId = `result_${randomString()}`;
  // const chromaCollection = await chromaConnect();

  const enrichedResult = { data: result };

  const vector = enrichedResult.data;

  // const add = await chromaCollection.add(
  //   [resultId],
  //   undefined,
  //   [{ path: path, task: task, result: result }],
  //   [vector],
  // );
  // console.log('collectionadd: ', add);
}


export { analyzeCode };