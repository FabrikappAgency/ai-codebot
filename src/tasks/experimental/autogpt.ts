import { AutoGPT } from 'langchain/experimental/autogpt';
import { ReadFileTool, WriteFileTool, SerpAPI } from 'langchain/tools';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import AppConfig from '../../config/config.js';
import { NodeFileStore } from 'langchain/stores/file/node';
import { ForLoopTool } from '../../tools/for_loop.js';

// const store = new InMemoryFileStore();
const store = new NodeFileStore('./data/store');

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

const result = await autogpt.run(['Get file cities.txt, read content and write today\'s weather report for each cities in report_{city_name}.txt file']);
console.log("resultzz", result);
