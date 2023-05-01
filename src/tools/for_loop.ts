import { log } from 'console';
import { ReadFileTool, SerpAPI, Tool, WriteFileTool } from 'langchain/tools';
import AppConfig from '../config/config.js';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { AutoGPT } from 'langchain/experimental/autogpt';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { NodeFileStore } from 'langchain/stores/file/node';

const store = new NodeFileStore('./data/store');

interface LoopArgs {
  command_input: string;
  command: string;
  args: Record<string, string>;
  iterables: Record<string, string[]>;
}

class ForLoopTool extends Tool {
  name = 'for_loop';
  description = `A tool to manage for loops. Useful when you need to iterate over a command multiple times. The input should be a JSON formatted object that contains the name of the command to use, iterables, and additional arguments. The JSON must return an input object containing the following keys: "command" as a string, "iterables" as an array of strings, and "args" as a Record<string, string>. Example of the input object: {"input": {"command": "<name_of_command>", "command_input": "some text {<name_of_key>}", "iterables": {"<name_of_key>": ["<value_1>, <value_2>, ..."]}}}`;

  params: Record<string, string>;

  constructor(params: Record<string, string> = {}) {
    super();
    this.params = params;
  }

  async _call(input: string): Promise<string> {
    log('ForLoopTool._call started with input', input);
    const payload: LoopArgs = JSON.parse(input);
    log('ForLoopTool._call payload', { payload });
    let result = '';

    for (const [key, value] of Object.entries(payload.iterables)) {
      log('ForLoopTool._call iterable', { key, value });

      for (const item of value) {
        log('ForLoopTool._call item', { item });
        const str = payload.command_input.replace(`{${key}}`, item);

        const taskResult = await this.executeCommand(payload.command, item, str);
        result += `\n${taskResult}`;
      }
    }
    return result;
  }

  async executeCommand(
    command: string,
    iterable: string,
    command_input: string,
    args?: Record<string, string>,
  ): Promise<string> {
    log('ForLoopTool.executeCommand', {
      command,
      iterable,
      command_input,
      args,
    });

    const commandToExecute = `Execute command ${command} for ${iterable} with args ${command_input}`;
    log('ForLoopTool.commandToExecute', { commandToExecute });
    await this.startTaskAgent(commandToExecute);
    return commandToExecute;
  }

  async startTaskAgent(task: string): Promise<string> {
    const tools = [
      new ForLoopTool(),
      new ReadFileTool({ store }),
      new WriteFileTool({ store }),
      new SerpAPI(AppConfig.serpApiKey, {
        location: 'San Francisco,California,United States',
        hl: 'en',
        gl: 'us',
      }),
    ];

    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

    const autogpt = AutoGPT.fromLLMAndTools(
      new ChatOpenAI({ temperature: 0 }),
      tools,
      {
        memory: vectorStore.asRetriever(),
        aiName: 'Tom',
        aiRole: 'Assistant',
      },
    );

    const taskResult = await autogpt.run([task]);

    return taskResult;
  }
}

export { ForLoopTool };