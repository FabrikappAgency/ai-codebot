
import dotenv from 'dotenv';
dotenv.config();

interface Config {
  serpApiKey: string;
  chromaClientUrl: string;
  chromaTableName: string;
  openaiApiKey: string;
  openaiApiModel: string;
  tableName: string;
  babyName: string;
  contextRootPath: string;
  dataRootPath: string;
  projectRootPath: string;
}

const AppConfig: Config = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiApiModel: process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
  tableName: process.env.TABLE_NAME || '',
  babyName: process.env.BABY_NAME || '',
  contextRootPath: process.env.CONTEXT_ROOT_PATH || '',
  dataRootPath: process.env.DATA_ROOT_PATH || '',
  projectRootPath: process.env.PROJECT_ROOT_PATH || '',
  serpApiKey: process.env.SERPAPI_API_KEY || '',
  chromaTableName: process.env.CHROMA_TABLE_NAME || '',
  chromaClientUrl: process.env.CHROMA_CLIENT_URL || 'http://localhost:8000',
};

export default AppConfig;
