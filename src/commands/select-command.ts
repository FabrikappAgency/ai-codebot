import { isCancel, outro, select } from '@clack/prompts';
import { greeter } from './greeter.js';
import { chatCompletionCommand, codeAnalysisCommand } from './index.js';

interface Command {
  id: string;
  name: string;
  description: string;
  run: () => Promise<void>;
}

enum Commands {
  CHAT = 'chat',
  CODE_ANALYSYS = 'code-analysis',
  GREETER = 'greeter',
}
const commands = new Map<Commands, Command>([
  [
    Commands.GREETER,
    {
      id: Commands.GREETER,
      name: 'Hello',
      description: 'Hello',
      run: async () => {
        const greet = await greeter('Hellzzo');
        console.log(greet);
      },
    },
  ],
  [
    Commands.CHAT,
    {
      id: Commands.CHAT,
      name: 'Chat',
      description: 'Chat',
      run: async () => {
        console.log('Chat outpu');
        await chatCompletionCommand();
      },
    },
  ],
  [
    Commands.CODE_ANALYSYS,
    {
      id: Commands.CODE_ANALYSYS,
      name: 'Code analysis',
      description: 'Code analysi',
      run: async () => {
        console.log('Code analysis');
        await codeAnalysisCommand();
      },
    },
  ],
]);

const selectCommand = async (): Promise<void> => {
  const projectType: Commands = (await select({
    message: 'Pick a command',
    options: [
      { value: Commands.CHAT, label: 'Chat' },
      { value: Commands.CODE_ANALYSYS, label: 'Code Analysis' },
      { value: Commands.GREETER, label: 'Greeter', hint: 'oh no' },
    ],
  })) as Commands;

  if (isCancel(projectType)) {
    outro(`You're all set!`);
    process.exit(0);
  }
  //   switch (projectType) {
  const command = commands.get(projectType);
  //   console.log(projectType, command);
  await command?.run();
  //   await greeter(`${String(projectType)}`).then((greeting) =>
  //     console.log(greeting),
  //   );
  selectCommand();
};

export { selectCommand };
