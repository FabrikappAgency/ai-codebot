import dotenv from 'dotenv';
import openaiPackage from '@tectalic/openai';

class OpenAIService {
  private openaiClient: any;

  constructor() {
    dotenv.config();
    this.openaiClient = openaiPackage.default(process.env.OPENAI_API_KEY);
  }

  public getOpenAIClient(): any {
    return this.openaiClient;
  }
}

export default OpenAIService;