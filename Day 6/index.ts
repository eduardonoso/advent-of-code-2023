const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['test'])

function run(data: string[]): []{
    const results: [] = [];
    console.log(data)

    const races = buildRaces(data)

    console.log('races', races)
    return results;
}

function buildRaces(data: string[]){
    const races: {}[] = []
    data.forEach(row => {
        const split = row.split(':')
        const field = split[0]
        const regExp = new RegExp('\\s[0-9]+', 'g')
        const matchIterator = regExp[Symbol.matchAll](split[1])
        const matches = [];
        for (const match of matchIterator) {
            matches.push(Number(match[0].trim()))
        }
        for(const key in matches){
            const value = matches[key]
            const fieldObject: any = {}
            fieldObject[field] = value
            races[key as keyof Object] = {...races[key as keyof Object], ...fieldObject}
        }
    })
    return races
}