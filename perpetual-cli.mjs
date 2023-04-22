import { promptModel } from "./modelCommands.mjs";
import { chatCompletion, runCommand, analyzeCode } from "./commands/index.mjs";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";

async function fetchData(query) {
  const spinner = ora("Fetching data...").start();

  const result = await chatCompletion(query);
  spinner.stop();
  console.log(chalk.green(`Fetched data for query: ${query}`));
  console.log(result);
}
async function analyzeCodeCmd(path, prompt = "", replaceCode = false) {
  const spinner = ora(
    `Analyze code for page ${path} with prompt ${prompt}`
  ).start();

  const result = await analyzeCode(path, prompt, replaceCode).catch((err) => {
    spinner.stop();
    return;
  });
  spinner.stop();
  console.log(chalk.green(`Analyze code for page : ${path} done.`));
  console.log(result);
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
    } else if (answer.toLowerCase().startsWith("codefix")) {
      const words = answer.split(" ");
      words.shift(); // remove the first word
      const path = words[0];
      words.shift(); // remove the first word
      const prompt = words.join(" ");
      await analyzeCodeCmd(path, prompt, true);
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
