import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ProblemHandler = () => {
  const getData = (dayName, filename) => {
    const filePath = path.join(__dirname, '..', dayName, filename)
    return fs.readFile(filePath, 'utf8')
  }
  const run = (dayName, filenames, callback) => {
    //TODO: Grab dayName here instead of passing it in
    console.log(`----- ${dayName} -----`)
    for (const filename of filenames) {
      getData(dayName, filename).then(data => {
        const results = callback(data)
        console.log(filename, results)
      })
    }
  }
  return {
    getData,
    run
  }
}

export default ProblemHandler
