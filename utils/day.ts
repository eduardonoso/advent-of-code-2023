const problemHandler = require('../utils/problemHandler.js')

function processData(data: []): number {
  let result: number = 0
  for (const d of data) {
    console.log(d)
    result += 1
  }
  return result;
}

function run(data: []): number[] {
  const results: number[] = [];
  const result = processData(data);
  results.push(result)
  return results;
}

problemHandler(__filename, run)
