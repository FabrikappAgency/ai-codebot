import openai from 'openai';
import inquirer from 'inquirer';

openai.apiKey = process.env.OPENAI_API_KEY;

async function updateModel(modelId, role, content) {
  const prompt = `${role}: ${content}`;

  const completion = await openai.Completion.create({
    engine: modelId,
    prompt: prompt,
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  console.log('Updated model with new content:');
  console.log(completion.choices[0].text.trim());
}

async function main() {
  const modelIdAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'modelId',
      message: 'Enter the model ID:',
    },
  ]);

  const roleAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: 'Select role:',
      choices: ['system', 'user', 'assistant'],
    },
  ]);

  const contentAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'content',
      message: 'Input content:',
    },
  ]);

  updateModel(modelIdAnswer.modelId, roleAnswer.role, contentAnswer.content);
}

main();
