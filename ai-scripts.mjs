import { Command } from 'commander';
import { updateModel, createModel, fetchModels, createModelFromFile, fetchFiles, fetchFineTunes, promptModel, chatCompletion } from './modelCommands.mjs';

const program = new Command();

program
  .command('prompt')
  .description('prompt a model')
  .action(promptModel).argument('<prompt>', 'prompt text').argument('[modelId]', 'model id');

program
  .command('chat')
  .description('chat completion')
  .action(chatCompletion).argument('<prompt>', 'prompt text');

program
  .command('update-model')
  .description('Update a model with new data')
  .action(updateModel);

program
  .command('create-model')
  .description('Create a new model')
  .action(createModelFromFile);

program
  .command('fetch-files')
  .description('Fetch all files belonging to the account')
  .action(fetchFiles);

program
  .command('fetch-models')
  .description('Fetch all models belonging to the account')
  .action(fetchModels);

program.parse(process.argv);
