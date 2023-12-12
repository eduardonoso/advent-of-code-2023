const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['test'])

function run(data: []): number[] {
    const results: number[] = [];
    let result = processData(data);
    results.push(result.lowestLocation)
    results.push(result.lowestLocationSeedRange)
    return results;
}

interface MapRange {
    destination: number,
    source: number,
    length: number
}

type MapData = {
    [key: string]: MapRange[]
} & { seeds: number[] };

const mapHeaders = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location'
];

let cache: any[] = []

function processData(data: string[]) {

    const mapData: MapData = {
        seeds: [],
        seedToSoil: [],
    };

    data.forEach((d, i) => {

        if (d.includes('seeds:')) {
            mapData.seeds = d.split('seeds:')[1].split(' ').filter(s => s !== '').map(s => Number(s))
        }

        mapHeaders.forEach(header => {
            if (d.includes(header)) {
                const camelCase: string = toCamelCase(header)
                if (!mapData[camelCase as keyof MapData]) mapData[camelCase] = [];
                for (let j = i + 1; j < data.length; j++) {
                    if (data[j] === '') break
                    const split = data[j].split(' ')
                    const mapRange: MapRange = {
                        destination: Number(split[0]),
                        source: Number(split[1]),
                        length: Number(split[2])
                    };
                    (mapData[camelCase as keyof MapData] as MapRange[]).push(mapRange)
                }
            }
        })
    })
    mapHeaders.forEach(header => {
        mapData[toCamelCase(header)].sort((a, b) => {
            if (a.destination < b.destination) return -1
            if (b.destination < a.destination) return 1
            return 0
        })
    })
    console.log('mapData', mapData);

    let lowestLocation = Infinity
    mapData.seeds.forEach(s => {
        let mappedValue = mapSeed(s, mapData)
        lowestLocation = lowestLocation < mappedValue ? lowestLocation : mappedValue
    })

    // Part 2

    let sortedSeeds = [];
    for (let i = 0; i < mapData.seeds.length; i += 2) {
        sortedSeeds.push({start: mapData.seeds[i], end: mapData.seeds[i] + mapData.seeds[i + 1]})
    }
    sortedSeeds.sort((a, b) => {
        if (a.start < b.start) return -1
        if (a.start > b.start) return 1
        return 0
    })
    console.log('sortedSeeds', sortedSeeds)

    let lowestLocationSeedRange = Infinity
    // for (let j = 0; j <= mapData.seeds.length; j += 2) {
    //     for (let seed = mapData.seeds[j]; seed < mapData.seeds[j] + mapData.seeds[j + 1]; seed++) {
    //         let mappedValue = cache[seed] || mapSeed(seed, mapData)
    //         cache[seed] = mappedValue
    //         if (mappedValue < lowestLocationSeedRange) lowestLocationSeedRange = mappedValue
    //
    //     }
    // }

    for (let location = 0; location < 100; location++) {
        if(!isLocationValid(location, mapData)) continue
        const seed = getSeedByLocation(location, mapData)
        //console.log('getSeedByLocation', location, seed)
        if (isSeedPresent(seed, mapData, sortedSeeds)) {
            lowestLocationSeedRange = location;
            console.log('BREAK', lowestLocationSeedRange, location)
            break
        }
    }

    // console.log('mapData', mapData)
    console.log('cache', cache)

    return {
        lowestLocation,
        lowestLocationSeedRange
    }
}

function isLocationValid(location: number, mapData: MapData){
    let isLocationValid = false;
    mapHeaders.slice().reverse().forEach(header => {
        for(let mapRange of mapData[toCamelCase(header)]){
            const isValid = location >= mapRange.destination && location < mapRange.destination + mapRange.length
            console.log(`${header} isValid?`, location, mapRange, isValid)
            if(isValid) return true

        }
    })
    return isLocationValid
}

function isSeedPresent(seed: number, mapData: MapData, sortedSeeds: {start: number, end: number}[]) {
    for (let j = 0; j < sortedSeeds.length; j++) {
        let startSeed = sortedSeeds[j].start
        let endSeed =  sortedSeeds[j].end
        const inRange = seed >= startSeed && seed < endSeed
        console.log('isSeedPresent', seed, startSeed, endSeed, inRange)
        if(inRange) return true


    }
}

function getSeedByLocation(location: number, mapData: MapData) {
    let mappedValue = location;
    for (let i = mapHeaders.length - 1; i >= 0; i--) {
        const header = mapHeaders[i]
        for (const mapRange of mapData[toCamelCase(header)]) {
            if (mappedValue >= mapRange.source && mappedValue < mapRange.source + mapRange.length) {
                mappedValue = mapRange.destination + (mappedValue - mapRange.source)
                break
            }
        }
    }
    return mappedValue
}

// function getLowestLocation(lowestLocationSeedRange: number, mapData: MapData, seed: number): number {
//     //let mappedValue =  mapSeed(seed, mapData)
//     let mappedValue = cache[seed] || mapSeed(seed, mapData)
//     cache[seed] = mappedValue
//     // console.log('getLowestLocation', cache[seed], seed)
//     return lowestLocationSeedRange < mappedValue ? lowestLocationSeedRange : mappedValue
// }

function mapSeed(s: number, mapData: MapData) {
    // console.log('----- map seed -----', s)
    let mappedValue = s;
    mapHeaders.forEach(header => {
        const camelCase: string = toCamelCase(header)
        for (const mapRange of mapData[camelCase]) {
            if (mappedValue >= mapRange.source && mappedValue < mapRange.source + mapRange.length) {
                mappedValue = mapRange.destination + (mappedValue - mapRange.source)
                break
            }
        }
    })
    return mappedValue
}

function toCamelCase(s: string): string {
    return s.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}
