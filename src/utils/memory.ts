import fs from 'fs';
import { Message } from '../interfaces/interface.js';
import AppConfig from '../config/config.js';
const dataFilePath = `${AppConfig.dataRootPath}/memory/data.json`;

async function clearMessages(): Promise<void> {
  return fs.writeFileSync(dataFilePath, JSON.stringify({ messages: [] }));
}

async function addMessage(newMessage: Message): Promise<Message[]> {

  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  data.messages.push(newMessage);

  fs.writeFileSync(dataFilePath, JSON.stringify(data));

  return data.messages;
}

export { clearMessages, addMessage };
