import * as fs from "node:fs/promises"
import * as path from "node:path"
import {fileURLToPath} from 'url';

// Not available in Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`----- ${__filename} -----`)

const processFile = async (filename) => {
  const results = [];
  const filePath = path.join(__dirname, filename)
  const data = await fs.readFile(filePath, 'utf8')
  results.push(getNumbers(data, new RegExp('(?=([0-9]))', 'g')));
  results.push(getNumbers(data, new RegExp('(?=(one|two|three|four|five|six|seven|eight|nine|zero|[0-9]))', 'g')));
  return results;
}


export const run = async () => {
  await processFile('test.txt').then(results => console.log('test:', results));
  await processFile('data.txt').then(results => console.log('results:', results));
}

run();
