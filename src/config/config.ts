
import dotenv from 'dotenv';
dotenv.config();

interface Config {
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
};

export default AppConfig;
