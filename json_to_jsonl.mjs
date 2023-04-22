import fs from 'fs';
import path from 'path';

async function jsonToJSONL(filePath) {
  const inputPath = path.resolve(filePath);
  const outputPath = inputPath.replace(/\.json$/, '.jsonl');

  try {
    const data = await fs.promises.readFile(inputPath, 'utf8');
    const jsonArray = JSON.parse(data);
    const jsonlLines = jsonArray.map(jsonObj => JSON.stringify(jsonObj)).join('\n');

    await fs.promises.writeFile(outputPath, jsonlLines, 'utf8');
    console.log(`JSONL file created: ${outputPath}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

const [, , inputFile] = process.argv;

if (!inputFile) {
  console.error('Usage: node json_to_jsonl.mjs <input_file>');
  process.exit(1);
}

jsonToJSONL(inputFile);
