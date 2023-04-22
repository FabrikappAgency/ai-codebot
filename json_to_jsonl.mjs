import fs from 'fs';
import path from 'path';
import JSONStream from 'JSONStream';

async function convertJsonToJsonl(inputFilePath) {
  const inputPath = path.resolve(inputFilePath);
  const outputPath = inputPath.replace(/\.json$/, '.jsonl');

  if (!fs.existsSync(inputPath)) {
    console.error('Error: input file does not exist');
    process.exit(1);
  }

  const jsonStream = fs.createReadStream(inputPath).pipe(JSONStream.stringify());
  const outputStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

  jsonStream.on('error', err => {
    console.error(`Error: ${err}`);
  });

  outputStream.on('error', err => {
    console.error(`Error: ${err}`);
  });

  outputStream.on('finish', () => {
    console.log(`JSONL file created: ${outputPath}`);
  });

  jsonStream.pipe(outputStream);
}

const [, , inputFile] = process.argv;

if (!inputFile) {
  console.error('Usage: node convert-json-to-jsonl.js <input_file>');
  process.exit(1);
}

convertJsonToJsonl(inputFile);