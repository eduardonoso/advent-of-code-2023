import {fileURLToPath} from 'url';
import problemHandler from '../utils/problemHandler.js'

const filename = fileURLToPath(import.meta.url);

const getNumbers = (data, regExp) => {

  const convertToNumeral = (string) => {
    if (!isNaN(Number(string))) return string
    const numeralMap = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9
    }
    return numeralMap[string].toString()
  }

  return data
  .map(s => {
    if (!s) return null

    const matchIterator = regExp[Symbol.matchAll](s)
    const matches = [];
    for (const match of matchIterator) {
      matches.push(match[1])
    }
    if (!matches.length) return null

    const str = convertToNumeral(matches[0]) + convertToNumeral(matches[matches.length - 1]);
    return Number(str);
  }).reduce((prev, curr) => {
    return prev + curr
  });
}

const run = (data) => {
  const results = [];
  results.push(getNumbers(data, new RegExp('(?=([0-9]))', 'g')));
  results.push(getNumbers(data, new RegExp('(?=(one|two|three|four|five|six|seven|eight|nine|zero|[0-9]))', 'g')));
  return results;
}

problemHandler(filename, run)
