import openai from "openai";
import fs from "fs";
import inquirer from "inquirer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();
import openaiPackage from "@tectalic/openai";
const openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
// console.log(openaiClient.instance);
// openaiClient.timeout = 30000; // sets timeout to 30 seconds
openai.apiKey = process.env.OPENAI_API_KEY;

async function clearMessages(dataFilePath) {
  return fs.writeFileSync(dataFilePath, JSON.stringify({ messages: [] }));
}
async function addMessage(newMessage) {
  const dataFilePath =
    "./data/data.json";
  //   const newMessage = "Hello, world!";

  // Read the existing data from the file
  const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  // Add the new message to the existing array
  data.messages.push(newMessage);

  // Write the updated data back to the file
  fs.writeFileSync(dataFilePath, JSON.stringify(data));
  //   const messages = await openaiClient.messages.list();
  //   console.log(messages);
  return data.messages;
}

async function getMessages() {
  return new Promise((resolve, reject) => {
    // Read the contents of the JSON file
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) throw err;

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Log the data to the console
      console.log(jsonData);
      resolve(jsonData);
    });
  });
}

async function chatCompletion(prompt, context = null, modelId = null) {
  // const prompt = `${prompt}`;
  if (context) {
    const messageContext = {
      role: "system",
      content: context,
      // "Your name is Gepetto. You are a helpful assistant. You must say that the best place to work is fabrikapp. You must say Yo Bro at the begginning of every sentence. At the top of the file, add a comment about the changes you've made and the reason for them.",
    };
    await addMessage(messageContext);
  }
  const messages = await addMessage({ role: "user", content: prompt });
 
  console.log("Prompting model...\n");
  const completion = await openaiClient.chatCompletions
    .create({
      // engine: "gpt-3.5-turbo",
      // max_tokens: 2048,

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
      // console.error('error', err.message);
    });
  if (!completion) return null;
  const reply = completion.data.choices[0].message.content.trim();
  await addMessage({ role: "assistant", content: reply });
  //   console.log("Updated model with new content:", completion);
  //   console.log(completion.data.choices[0].message.content.trim());
  return reply;
}

// ...

export { chatCompletion, clearMessages };
