const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['data'])

type Race = {
    Time: number,
    Distance: number
}

function run(data: string[]): number[] {
    const results: number[] = [];

    const races = buildRaces(data)

    const totalModesToWin = calculateAllRacesModesToWin(races)
    results.push(totalModesToWin)

    const singleRace = races.reduce((prev, curr) => {
        return {
            Time: Number(`${prev.Time}${curr.Time}`),
            Distance: Number(`${prev.Distance}${curr.Distance}`)
        }
    }, {Time: 0, Distance: 0})
    const singleRaceModesToWin = calculateRaceModesToWin(singleRace)
    results.push(singleRaceModesToWin)

    return results;
}

function calculateAllRacesModesToWin(races: Race[]): number {
    return races.map(race => {
        return calculateRaceModesToWin(race)
    }).reduce((prev, curr) => {
        return prev * curr
    }, 1)
}

function calculateRaceModesToWin(race: Race) {
    // where: x=5, t=30, d=125
    // e.g. 125/(30-5) = 5
    // formula: d/(t-x) = x   or   d = tx - x^2     or    x^2 = tx - d
    // Use quadratic formula for calculating min viable time: x = (t - sqrt(t^2 - 4d))/2
    let minViableTime = ((race.Time - Math.sqrt((race.Time * race.Time) - (4 * race.Distance))) / 2)
    if (Number.isInteger(minViableTime)) minViableTime++ // Ensure we beat the distance
    return (race.Time - Math.ceil(minViableTime) - Math.ceil(minViableTime) + 1)
}

function buildRaces(data: string[]): Race[] {
    const races: Race[] = []
    data.forEach(row => {
        const split = row.split(':')
        const field = split[0]
        const regExp = new RegExp('\\s[0-9]+', 'g')
        // @ts-ignore
        const matchIterator = regExp[Symbol.matchAll](split[1])
        const matches = [];
        for (const match of matchIterator) {
            matches.push(Number(match[0].trim()))
        }
        for (const key in matches) {
            const value = matches[key]
            const fieldObject: any = {}
            fieldObject[field] = value
            races[key as keyof Object] = {...races[key as keyof Object], ...fieldObject}
        }
    })
    return races
}

