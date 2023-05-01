import fs from 'fs';
import { WebBrowser } from 'langchain/tools/webbrowser';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { RequestsGetTool, RequestsPostTool, AIPluginTool } from 'langchain/tools';
import { addMessage, clearMessages } from '../utils/index.js';
import OpenAIService from '../client/clients.js';

const openAIService = new OpenAIService();

async function getMessages() {
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) throw err;
      const jsonData = JSON.parse(data);
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
      headers: {},
    };
    const browser = new WebBrowser({ model, embeddings });
    console.log('browser', browser);
    const result = await browser.call(
      `"https://redux-toolkit.js.org/usage/usage-with-typescript","how do i generate a side effect for a request?`,
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
  if (context) {
    const messageContext = {
      role: 'system',
      content: context,
    };
    await addMessage(messageContext);
  }
  const messages = await addMessage({ role: 'user', content: prompt });

  console.log('Prompting model...\n');
  const completion = await openAIService.getOpenAIClient().chatCompletions
    .create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 2000,
      n: 1,
      stop: null,
      temperature: 0.7,
    })
    .catch((err: { response?: any }) => {
      console.error('Error keys:', Object.keys(err));
      console.error('error', err);
      console.error(
        'error message',
        err.response ? err.response?.data?.error : 'no error message',
      );
    });
  if (!completion) return null;
  console.log(completion);
  const reply = completion.data.choices[0].message.content.trim();
  await addMessage({ role: 'assistant', content: reply });
  return reply;
}

export { chatCompletion, clearMessages, llmCompletion, chatLLMCompletion };