import {
  cancel,
  multiselect,
  spinner,
  text,
  group,
  confirm,
} from '@clack/prompts';
import { chatCompletion } from '../tasks/chat-completion.js';
import chalk from 'chalk';
import { analyzeCode } from '../tasks/index.js';
const s = spinner();
interface CodeAnalysisPrompts {
  path: string | symbol;
  query: string | symbol;
  options?: void | symbol | string[];
  replace: boolean | symbol;
}
async function codeAnalysisCommand(): Promise<void> {
  // const spinner = ora('Fetching data...').start();

  // Do installation

  const promptsGroup = await group<CodeAnalysisPrompts>(
    {
      path: () => text({ message: 'What is the path of the file?' }),
      query: () => text({ message: 'What is your query?' }),
    //   options: ({ results }) =>
    //     multiselect({
    //       message: `What is your favorite color ${results.path}?`,
    //       options: [
    //         { value: 'red', label: 'Red' },
    //         { value: 'green', label: 'Green' },
    //         { value: 'blue', label: 'Blue' },
    //       ],
    //     }),
      replace: () =>
        confirm({
          message: 'Do you want to replace code?',
        }),
    },

    {
      // On Cancel callback that wraps the group
      // So if the user cancels one of the prompts in the group this function will be called
      onCancel: ({ results }) => {
        cancel('Operation cancelled.');
        process.exit(0);
      },
    },
  );
  //   console.log(promptsGroup.name, promptsGroup.age, promptsGroup.color);

  if (typeof group === 'symbol') {
    return console.log(chalk.red('Cancelled'));
  }
  try {
    s.start('Analyzing...');
    const result = await analyzeCode(promptsGroup.path, promptsGroup.query, promptsGroup.replace);
    s.stop('Code Analysis done');
    console.log(chalk.green(`Fetched data for query: ${promptsGroup.path}`));
    console.log(result);
    await codeAnalysisCommand();
  } catch (err) {
    console.log(
      chalk.red(`Error fetching data for query: ${promptsGroup.path}`, err),
    );
    s.stop('Error');
    console.log(err);
  }
}

export { codeAnalysisCommand };
