import { promptModel } from "./modelCommands.mjs";
import { chatCompletion, runCommand, analyzeCode, codeTask } from "./commands/index.mjs";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
// import { execution_agent } from "./commands/execution_agent.mjs";
import { execution_agent, chromaConnect } from "./babyagi/babyagi.js";

async function fetchData(query) {
  const spinner = ora("Fetching data...").start();

  try {
    const result = await chatCompletion(query);
    spinner.stop();
    console.log(chalk.green(`Fetched data for query: ${query}`));
    console.log(result);
  } catch (err) {
    console.log(chalk.red(`Error fetching data for query: ${query}`, err));
    spinner.stop();
  }
}
async function startAgent(taskName) {
  const spinner = ora("Fetching data...").start();
  const objective = taskName
  try {
    const initialTask = {
      taskId: 1,
      taskName: taskName,
    };
    // add_task(initialTask);
    const chromaCollection = await chromaConnect();
    const result = await execution_agent(objective, initialTask.taskName, chromaCollection);
    spinner.stop();
    console.log(chalk.green(`Fetched data for query: ${objective} (${taskName}) : ${result}`));
    console.log(result);
  } catch (err) {
    console.log(chalk.red(`Error fetching data for query: ${objective}`, err));
    spinner.stop();
  }
}

async function analyzeCodeCmd(path, prompt = "", replaceCode = false) {
  const spinner = ora(
    `Analyze code for page ${path} with prompt ${prompt}`
  ).start();

  try {
    const { summary, analyze } = await analyzeCode(path, prompt, replaceCode);
    spinner.stop();
    console.log(chalk.green(`Analyze code for page : ${path} done. `));
  } catch (err) {
    console.log(chalk.red(`Error analyzing code for page : ${path}`, err));
    spinner.stop();
  }
}

async function codeTaskCmd(prompt = "", replaceCode = false) {
  const spinner = ora(
    `Code task with prompt ${prompt}`
  ).start();

  try {
    const result = await codeTask(prompt);
    spinner.stop();
    console.log(chalk.green(`Code task for ${prompt} done.`));
    console.log(result);
  } catch (err) {
    spinner.stop();
  }
}

async function askQuestion() {
  try {
    const { answer } = await inquirer.prompt([
      {
        type: "input",
        name: "answer",
        message:
          chalk.yellow("What do you want to fetch? (Type ") +
          chalk.red("exit") +
          chalk.yellow(" to quit):"),
      },
    ]);

    if (answer.toLowerCase() === "exit") {
      return;
    }

    if (answer.toLowerCase().startsWith("runcommand")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const command = words.join(" "); // join remaining words back into a string
      await runCommand(command);
      askQuestion();
    } else if (answer.toLowerCase().startsWith("code")) {
      await analyzeCodeCmd("commands/child_process.mjs");
      askQuestion();
    } else if (answer.toLowerCase().startsWith("agent")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const prompt = words.join(" ");
      await startAgent(prompt);
      askQuestion();
    } else if (answer.toLowerCase().startsWith("fixcode")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const path = words[0];
      words.shift(); // remove the first word
      const prompt = words.join(" ");
      await analyzeCodeCmd(path, prompt, true);
      askQuestion();
    } else if (answer.toLowerCase().startsWith("task")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const path = words[0];
      words.shift(); // remove the first word
      const prompt = words.join(" ");
      await codeTaskCmd(prompt, true);
      askQuestion();
    } else if (answer.toLowerCase().startsWith("analyzecode")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const path = words[0];
      words.shift(); // remove the first word
      const prompt = words.join(" ");
      await analyzeCodeCmd(path, prompt);
      askQuestion();
    } else {
      await fetchData(answer);
      askQuestion();
    }
  } catch (error) {
    console.log(chalk.red(`Error happened! ${error}`));
    console.log(chalk.green(error));
    askQuestion();
  }
}

askQuestion();