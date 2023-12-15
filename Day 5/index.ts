const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['data'])

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
    length: number,
    offset: number
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

function processData(data: string[]) {
    const startTime = new Date()
    const mapData: MapData = buildMapData(data)

    // Part 1
    let lowestLocation = Infinity
    mapData.seeds.forEach(s => {
        let mappedValue = mapSeed(s, mapData)
        lowestLocation = lowestLocation < mappedValue ? lowestLocation : mappedValue
    })

    // Part 2
    let convertedRanges: { start: number, end: number }[] = [];
    for (let i = 0; i < mapData.seeds.length; i += 2) {
        convertedRanges.push({start: mapData.seeds[i], end: mapData.seeds[i] + mapData.seeds[i + 1]})
    }
    for (const header of mapHeaders.map(header => toCamelCase(header))) {
        convertedRanges = convertToRange(convertedRanges, mapData[header], header)
    }

    const endTime = new Date()
    const elapsed = endTime.getTime() - startTime.getTime()

    console.log('Run time:', `${elapsed} ms`)

    return {
        lowestLocation,
        lowestLocationSeedRange: convertedRanges[0].start
    }
}

function buildMapData(data: string[]): MapData {
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
                        length: Number(split[2]),
                        offset: Number(split[0]) - Number(split[1])
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

    return mapData
}

function convertToRange(inputs: any, mapRanges: MapRange[], header: string) {
    const outputs = []
    // Iterate through all ranges for header
    while (inputs.length > 0) {
        const input = inputs.pop()
        let mappingFound = false
        for (const range of mapRanges) {
            let overlapStart = Math.max(input.start, range.source)
            let overlapEnd = Math.min(input.end, range.source + range.length)
            //Intersection found
            if (overlapStart < overlapEnd) {
                const overlapRange = {
                    start: overlapStart - range.source + range.destination,
                    end: overlapEnd - range.source + range.destination
                }
                outputs.push(overlapRange)
                mappingFound = true
                //Need to test outer bounds not intersected with this range
                if (input.start < overlapStart) {
                    inputs.push({start: input.start, end: overlapStart})
                }
                if (input.end > overlapEnd) {
                    inputs.push({start: overlapEnd, end: input.end})
                }
            }
        }
        // Pass through values without mappings
        if (!mappingFound) outputs.push({start: input.start, end: input.end})
    }
    return outputs;
}

function mapSeed(seed: number, mapData: MapData) {
    return mapHeaders.map(header => toCamelCase(header)).reduce((prev, header) => {
        for (const mapRange of mapData[header]) {
            if (prev >= mapRange.source && prev < mapRange.source + mapRange.length) {
                return mapRange.destination + (prev - mapRange.source)
            }
        }
        return prev
    }, seed)
}

function toCamelCase(s: string): string {
    return s.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}
