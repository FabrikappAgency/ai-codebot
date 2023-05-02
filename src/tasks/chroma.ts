import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import AppConfig from '../config/config.js';

const embeddingFunction = new OpenAIEmbeddingFunction(AppConfig.openaiApiKey);
const TABLE_NAME = AppConfig.chromaTableName;
const chroma = new ChromaClient(AppConfig.chromaClientUrl);

const chromaConnect = async () => {
  const metric = 'cosine';
  const collections = await chroma.listCollections();
  const collectionNames = collections.map((c) => c.name);
  console.log('List collection', collections);
  if (collectionNames.includes(TABLE_NAME)) {
    const collection = await chroma.getCollection(
      TABLE_NAME,
      embeddingFunction,
    );
    return collection;
  } else {
    const collection = await chroma.createCollection(
      TABLE_NAME,
      {
        'hnsw:space': metric,
      },
      embeddingFunction,
    );
    return collection;
  }
};

async function saveToChroma(
  task: string,
  result: string,
  path: string,
): Promise<void> {
  const randomString = (): string => Math.random().toString(36).substring(2, 8);
  const resultId = `result_${randomString()}`;

  const enrichedResult = { data: result };
  const vector = enrichedResult.data;

  const chromaCollection = await chromaConnect();
  const add = await chromaCollection.add(
    [resultId],
    undefined,
    [{ path: path, task: task, result: result }],
    [vector],
  );
  console.log('collectionadd: ', add);
}

export { saveToChroma, chromaConnect };
