const problemHandler = require('../utils/problemHandler.js')

let cache = {};

//If number
//Find end of number
//Check all spaces surrounding entire number spaces checking stored results first
//If contains a non-period, non-number character then capture the number and store checked locations in cache
//Sum all valid numbers
function processData(data: string[]): number {
    let result: number = 0
    let extractedNumbers = [];
    console.log(data)
    for (let row = 0; row < data.length; row++) {
        const rowData = data[row]
        console.log('process Row', row, rowData)
        for (let col = 0; col < rowData.length; col++) {
            const char = rowData[col]
             //console.log(char)

            if (!isNumber(char)) continue

            //Start of number found
            //Iterate over all spaces
            let extractedNumber = checkSurroundingSpaces(row, col, data, rowData)
            if(!isNumber(extractedNumber)) continue

            let moveAhead = extractedNumber.length
            //Check behind
            for (let xx = col - 1; xx >= 0; xx--) {
                const prevChar = rowData[xx]
                if (!isNumber(prevChar)) break
                extractedNumber = prevChar + extractedNumber; //TODO: Make sure we dont need to coerce to string
            }

            //Move ahead
            col += moveAhead
            extractedNumbers.push(Number(extractedNumber))
        }
    }
    console.log('extractedNumbers',extractedNumbers)
    return extractedNumbers.reduce((prev, curr) => {
        return prev + curr
    });
}

function isNumber(char : string) {
    const regExp = new RegExp('[0-9]','g')
    return regExp.test(char);
}

function updateCache(data: {}) {
    cache = {...cache, ...data}
}

function setCache(x: number, y: number, value: any) {
    //console.log('setCache', x, y, value)
    cache[`${x}:${y}` as keyof Object] = value
}

function getCache(x: number, y: number): any {
    // console.log('getCache', x, y)
    if (!cache.hasOwnProperty(`${x}:${y}` as keyof Object)) {
        //console.log('cache not found')
        return false
    }
    return cache[`${x}:${y}` as keyof Object]
}

function isSymbol(char: string): boolean {
    //console.log('isSymbol', char, !isNumber(char) && char !== '.')
    return !isNumber(char) && char !== '.'
}

function checkSurroundingSpaces(row: number, col: number, data: string[], rowData: string): string {
    let extractedNumber = data[row][col]
    let isValid = false;
    for (let x = -1; x < 2; x++) {

        if(isValid) break //TODO: I dont like this

        for (let y = -1; y < 2; y++) {
            if (x === 0 && y === 0) continue
            const offsetX = col + x;
            const offsetY = row + y;

            if (offsetX < 0 || offsetX >= rowData.length) continue
            if (offsetY < 0 || offsetY >= data.length) continue
            const char = data[offsetY][offsetX];

            console.log(`(${col}, ${row})`,`(${offsetX}, ${offsetY})`, data[offsetY][offsetX])


            const hasSymbol: boolean = getCache(offsetX, offsetY) || isSymbol(char);
            //console.log('hasSymbol', char, hasSymbol, getCache(offsetX, offsetY), isSymbol(char), hasSymbol)
            setCache(offsetX, offsetY, hasSymbol)



            //TODO: Need to walk full number and check all spaces

            if (!hasSymbol) continue

            //Find end of number
            for (let xx = col + 1; xx < rowData.length; xx++) {
                const nextChar = rowData[xx]
                if (!isNumber(nextChar)) break
                extractedNumber += nextChar; //TODO: Make sure we dont need to coerce to string
            }

            //console.log('extractedNumber', extractedNumber)
            isValid = true;
            break;
        }
    }
    if(!isValid) extractedNumber = '';
    console.log('extractedNumber', extractedNumber)
    return extractedNumber
}

function run(data: []): number[] {
    const results: number[] = [];
    const result = processData(data);
    results.push(result)
    return results;
}

problemHandler(__filename, run)
