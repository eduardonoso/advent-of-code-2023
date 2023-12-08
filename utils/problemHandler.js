const path = require('node:path');
const fs = require('node:fs/promises');

const problemHandler = (caller, callback, filenames = ['test.txt', 'data.txt']) => {

  const getData = (dayName, filename) => {
    const filePath = path.join(__dirname, '..', dayName, filename)
    return fs.readFile(filePath, 'utf8')
    .then(s => s.split('\r\n'))
    .then(d => removeTerminalReturn(d))
  }

  const removeTerminalReturn = (d) => {
    if(d.length === 0) return d;
    if (d[d.length - 1] === '') d.pop()
    return d;
  }

  const run = (caller, callback, filenames) => {
    const splitName = caller.split('\\');
    const dayName = splitName[splitName.length - 2]

    //TODO: Grab dayName here instead of passing it in
    console.log(`----- ${dayName} -----`)
    for (const filename of filenames) {
      getData(dayName, filename).then(data => {
        const results = callback(data)
        console.log(filename, results)
      })
    }
  }

  return run(caller, callback, filenames)
}

module.exports = problemHandler
