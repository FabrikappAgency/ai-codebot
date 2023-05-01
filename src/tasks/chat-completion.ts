import openai from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
import { WebBrowser } from 'langchain/tools/webbrowser';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { Configuration, OpenAIApi, OpenAIEmbeddingFunction } from "openai";
import pkg from 'openai';
const { Configuration, OpenAIApi, OpenAIEmbeddingFunction } = pkg;

// const embeddingFunction = OpenAIEmbeddingFunction(process.env.OPENAI_API_KEY);

// Configure OpenAI
// const configuration = new Configuration({
//   apiKey: OPENAI_API_KEY,
// });
// // const openai = new OpenAIApi(configuration);

// const openai = new OpenAIApi(configuration);

dotenv.config();
import openaiPackage from '@tectalic/openai';
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
// console.log(openaiClient.instance);
// openaiClient.timeout = 30000; // sets timeout to 30 seconds
openai.apiKey = process.env.OPENAI_API_KEY;
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import {
  RequestsGetTool,
  RequestsPostTool,
  AIPluginTool,
} from 'langchain/tools';
import AppConfig from '../config/config.js';
import { Message } from '../interfaces/interface.js';
import { addMessage, clearMessages } from '../utils/index.js';




async function getMessages() {
  return new Promise((resolve, reject) => {
    // Read the contents of the JSON file
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) throw err;

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Log the data to the console
      console.log(jsonData);
      resolve(jsonData);
    });
  });
}

async function llmCompletion(prompt: any, context = null, modelId = null) {
  try {
    const model = new ChatOpenAI({
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
    });
    const embeddings = new OpenAIEmbeddings({
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002',
    });

    const axiosConfig = {
      headers: {
        // "Content-Type": "text/plain",
      },
    };
    const browser = new WebBrowser({ model, embeddings });
    console.log('browser', browser);
    const result = await browser.call(
      // `"https://www.elle.fr/Astro/Horoscope/Quotidien/Verseau","quel est l'horosceop verseau en une phrase?`,
      // `"https://maplibre.org/maplibre-gl-js-docs/api/sources/","how to add a picture on the map?`,
      `"https://redux-toolkit.js.org/usage/usage-with-typescript","how do i generate a side effect for a request?`,
      // `"https://redux-toolkit.js.org/rtk-query/usage/mutations","how to use rtk for a basic app?`,
    );

    return result;
  } catch (error) {
    console.log(error.response, error);
  }
}

async function chatLLMCompletion(prompt: any, context = null, modelId = null) {
  clearMessages();
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await AIPluginTool.fromPluginUrl(
      'https://www.klarna.com/.well-known/ai-plugin.json',
    ),
  ];
  try {
    const agent = await initializeAgentExecutorWithOptions(
      tools,
      new ChatOpenAI({
        cache: false,
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
        // modelName: 'text-davinci-003',
        modelKwargs: {
          max_tokens: 1000,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
      }),
      { agentType: 'chat-zero-shot-react-description', verbose: true },
    );
    console.log(agent);
    const result = await agent.call({
      input: 'what t shirts are available in klarna?',
      context: null,
    });

    console.log({ result });
  } catch (error) {
    console.log(error, error.response);
  }
}

async function chatCompletion(prompt: string, context = null, modelId = null) {
  // const prompt = `${prompt}`;
  if (context) {
    const messageContext = {
      role: 'system',
      content: context,
      // "Your name is Gepetto. You are a helpful assistant. You must say that the best place to work is fabrikapp. You must say Yo Bro at the begginning of every sentence. At the top of the file, add a comment about the changes you've made and the reason for them.",
    };
    await addMessage(messageContext);
  }
  const messages = await addMessage({ role: 'user', content: prompt });

  console.log('Prompting model...\n');
  const completion = await openaiClient.chatCompletions
    .create({
      // engine: "gpt-3.5-turbo",
      // max_tokens: 2048,

      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 2000,
      n: 1,
      stop: null,
      temperature: 0.7,
    })
    .catch((err: { response?: any; }) => {
      console.error('Error keys:', Object.keys(err));

      console.error('error', err);
      console.error(
        'error message',
        err.response ? err.response?.data?.error : 'no error message',
      );
      // console.error('error', err.message);
    });
  if (!completion) return null;
  console.log(completion);
  const reply = completion.data.choices[0].message.content.trim();
  await addMessage({ role: 'assistant', content: reply });
  //   console.log("Updated model with new content:", completion);
  //   console.log(completion.data.choices[0].message.content.trim());
  return reply;
}

// ...

export { chatCompletion, clearMessages, llmCompletion, chatLLMCompletion };
