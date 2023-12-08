import {fileURLToPath} from 'url';
import problemHandler from '../utils/problemHandler.js'

const __filename = fileURLToPath(import.meta.url);


const buildDataObject = (data) => {

  const dataObject = data.map(d => {
    const split = d.split(':')
    const game = Number(split[0].replace('Game ', ''))

    const values = split[1].split(';').map(s => {
      const colorSplit = s.split(',')
      const red = convertColorValues(colorSplit, 'red')
      const green = convertColorValues(colorSplit, 'green')
      const blue = convertColorValues(colorSplit, 'blue')
      return {
        red,
        green,
        blue
      }
    })

    return {
      game,
      values
    }
  })

  function convertColorValues(colorSplit, color) {
    return parseInt(colorSplit.find(i => i.includes(color))?.replace(color, '')) || 0;
  }

  function sumValidGameIds(parameters) {
    const validGames = filterValidGames(parameters)
    return validGames.reduce((prev, curr) => {
      return prev + curr.game
    }, 0)
  }

  function filterValidGames(parameters) {
    return dataObject.filter(d => {
      const outOfBounds = d.values.find(values => {
        for (const [key, value] of Object.entries(parameters)) {
          if (values[key] > value) {
            return true
          }
        }
      })
      return !outOfBounds
    })
  }

  function calculateMinimumCubes() {
    for (const data of dataObject) {
      const minimums = {
        red: 0,
        green: 0,
        blue: 0
      }

      for (const colorValue of data.values) {
        for (const [key, value] of Object.entries(colorValue)) {
          minimums[key] = minimums[key] < value ? value : minimums[key]
        }
      }
      data.minimums = minimums;
    }
  }

  function sumCubePower() {
    let cuberPowerTotal = 0;

    calculateMinimumCubes();

    for (const data of dataObject) {
      let cubePower = 1;
      for (const [key, value] of Object.entries(data.minimums)) {
        cubePower *= value;
      }
      data.cubePower = cubePower;
      cuberPowerTotal += cubePower;
    }
    dataObject.cuberPowerTotal = cuberPowerTotal
    return cuberPowerTotal;
  }

  return {
    sumValidGameIds,
    sumCubePower
  }
}

function run(data) {
  const results = [];
  const dataObject = buildDataObject(data)
  const parameters = {red: 12, green: 13, blue: 14}
  results.push(dataObject.sumValidGameIds(parameters))
  results.push(dataObject.sumCubePower())
  return results;
}

problemHandler(__filename, run)
