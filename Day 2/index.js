import {fileURLToPath} from 'url';
import problemHandler from '../utils/problemHandler.js'

const __filename = fileURLToPath(import.meta.url);

const buildDataObject = (data) => {
  return data.map(d => {
    const split = d.split(':')
    const game = Number(split[0].replace('Game ',''))

    const convertColorValues = (colorSplit, color) => {
      return parseInt(colorSplit.find(i => i.includes(color))?.replace(color, '')) || 0;
    }

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
}

const filterValidGames = (dataObject, parameters) => {
  return dataObject.filter(d => {
    const outOfBounds = d.values.find(values => {
      for(const [key, value] of Object.entries(parameters)){
        if(values[key] > value) {
          return true
        }
      }
    })

    return !outOfBounds
  })
}

const calculateMinimumCubes = (dataObject) => {
  for(const data of dataObject){
    const minimums = {
      red: 0,
      green: 0,
      blue: 0
    }

    for(const colorValue of data.values) {
      for (const [key, value] of Object.entries(colorValue)) {
        minimums[key] = minimums[key] < value ? value : minimums[key]
      }
    }
    data.minimums = minimums;
  }
  return dataObject
}

const calculateCubePower = (dataObject) => {
  let cuberPowerTotal = 0;
  for(const data of dataObject){
    let cubePower = 1;
    for(const [key, value] of Object.entries(data.minimums)){
      cubePower *= value;
    }
    data.cubePower = cubePower;
    cuberPowerTotal += cubePower;
  }
  dataObject.cuberPowerTotal = cuberPowerTotal
  return dataObject;
}

const run = (data) => {
  const results = [];
  const dataObject = buildDataObject(data)

  const parameters = {
    red: 12,
    green: 13,
    blue: 14
  }

  const validGames = filterValidGames(dataObject, parameters)
  const validGameIdSummation = validGames.reduce((prev, curr) => {
    return prev + curr.game
  }, 0)
  results.push(validGameIdSummation)

  calculateMinimumCubes(dataObject)
  calculateCubePower(dataObject)
  results.push(dataObject.cuberPowerTotal)

  return results;
}

problemHandler(__filename, run)
