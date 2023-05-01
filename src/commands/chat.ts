import { spinner, text } from '@clack/prompts';
import { chatCompletion, chatLLMCompletion, llmCompletion } from '../tasks/chat-completion.js';
import chalk from 'chalk';
const s = spinner();

async function chatCompletionCommand(): Promise<void> {
  // const spinner = ora('Fetching data...').start();

  // Do installation

  const query = await text({
    message: 'Type a query',
    placeholder: 'Not sure',
    initialValue: '',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });
  if (typeof query === 'symbol') {
    return console.log(chalk.red('Cancelled'));
  }
  try {
    s.start('Fetching data...');
    const result = await llmCompletion(query);
    s.stop('Chat completion done');
    console.log(chalk.green(`Fetched data for query: ${query}`));
    console.log(result);
    await chatCompletionCommand();
  } catch (err) {
    console.log(chalk.red(`Error fetching data for query: ${query}`, err));
    s.stop('Error');
    console.log(err);
  }
}

export { chatCompletionCommand };
