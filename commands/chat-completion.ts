import openai from "openai";
import fs from "fs";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Configuration, OpenAIApi }  from 'openai'
dotenv.config();
import openaiPackage from "@tectalic/openai";
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
openai.apiKey = process.env.OPENAI_API_KEY;
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  RequestsGetTool,
  RequestsPostTool,
  AIPluginTool,
} from "langchain/tools";

async function clearMessages(dataFilePath: string): Promise<void> {
  return fs.writeFileSync(dataFilePath, JSON.stringify({ messages: [] }));
}

async function addMessage(newMessage: any): Promise<any> {
  const dataFilePath = "./data/data.json";

  const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  data.messages.push(newMessage);

  fs.writeFileSync(dataFilePath, JSON.stringify(data));

  return data.messages;
}

async function getMessages(): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) throw err;

      const jsonData = JSON.parse(data);

      console.log(jsonData);
      resolve(jsonData);
    });
  });
}

async function llmCompletion(prompt: string, context = null, modelId = null): Promise<void> {
  try {
    const model = new ChatOpenAI({
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    const embeddings = new OpenAIEmbeddings({
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });

    const axiosConfig = {
      headers: {
      },
    };
    const browser = new WebBrowser({ model, embeddings });
    console.log("browser", browser);
    const result = await browser.call(
      `"https://www.york.ac.uk/teaching/cws/wws/webpage1.html","who is joseph campbell"`
    );

    console.log(result);
  } catch (error) {
    console.log(error.response, error.response.data);
  }
}

async function chatLLMCompletion(prompt: string, context = null, modelId = null): Promise<void> {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await AIPluginTool.fromPluginUrl(
      "https://www.klarna.com/.well-known/ai-plugin.json"
    ),
  ];
  try {
    const agent = await initializeAgentExecutorWithOptions(
      tools,
      new ChatOpenAI({
        cache:false,
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-davinci-003",
        modelKwargs: {
          max_tokens: 2000,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
      }),
      { agentType: "chat-zero-shot-react-description", verbose: true }
    );
    console.log(agent);
    const result = await agent.call({
      input: "what t shirts are available in klarna?",
      context: null,
    });
  
    console.log({ result });
  } catch (error) {
    console.log(error, error.response, error.response.data);
  }
}

async function chatCompletion(prompt: string, context = null, modelId = null): Promise<string> {
  if (context) {
    const messageContext = {
      role: "system",
      content: context,
    };
    await addMessage(messageContext);
  }
  const messages = await addMessage({ role: "user", content: prompt });

  console.log("Prompting model...\n");
  const completion = await openaiClient.chatCompletions
    .create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 2000,
      n: 1,
      stop: null,
      temperature: 0.7,
    })
    .catch((err) => {
      console.error("Error keys:", Object.keys(err));
      console.error("error", err);
      console.error(
        "error message",
        err.response ? err.response?.data?.error : "no error message"
      );
    });
  if (!completion) return null;
  const reply = completion.data.choices[0].message.content.trim();
  await addMessage({ role: "assistant", content: reply });

  return reply;
}

export { chatCompletion, clearMessages, llmCompletion, chatLLMCompletion };