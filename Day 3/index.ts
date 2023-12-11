const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run)

function run(data: []): number[] {
    const results: number[] = [];
    let result = processData(data);
    results.push(result.sumPartNumbers)
    results.push(result.sumEnginePowers)
    return results;
}

function processData(data: string[]) {
    const extractedNumbers: number[] = getPartNumbers(data);
    const sumPartNumbers: number = extractedNumbers.reduce((prev, curr) => {
        return prev + curr
    }, 0);

    const extractedGearNumbers: number[] = getGearNumbers(data);
    const sumEnginePowers: number = extractedGearNumbers.reduce((prev, curr) => {
        return prev + curr
    }, 0);

    return {
        sumPartNumbers,
        sumEnginePowers
    }
}

function getPartNumbers(data: string[]) {
    let extractedNumbers = [];
    for (let row = 0; row < data.length; row++) {
        const rowData = data[row]
        for (let col = 0; col < rowData.length; col++) {
            const char = rowData[col]

            if (!isNumber(char)) continue

            const fullNumber = getFullNumber(col, row, data);
            const hasSymbol = checkSurroundingSpacesForSymbol(col, row, data, fullNumber)
            if (hasSymbol) extractedNumbers.push(Number(fullNumber))

            col += fullNumber.length
        }
    }
    return extractedNumbers
}

function getGearNumbers(data: string[]) {
    let extractedNumbers = [];
    for (let row = 0; row < data.length; row++) {
        const rowData = data[row]
        for (let col = 0; col < rowData.length; col++) {
            const char = rowData[col]


            if (!containsSymbol(char, '*')) continue

            const gearNumbers = checkSurroundingSpacesForGearNumbers(col, row, data)
            if (gearNumbers.length > 1) extractedNumbers.push(Number(gearNumbers[0]) * Number(gearNumbers[1]))

        }
    }
    return extractedNumbers
}

function checkSurroundingSpacesForSymbol(col: number, row: number, data: string[], fullNumber: string): boolean {
    for (let x = -1; x <= 1 + fullNumber.length; x++) {
        for (let y = -1; y <= 1; y++) {
            const targetX = col + x;
            const targetY = row + y;
            if (targetX < 0 || targetX >= data[row].length) continue
            if (targetY < 0 || targetY >= data.length) continue
            const char = data[targetY][targetX];

            if (!containsSymbol(char)) continue
            return true
        }
    }
    return false
}

function checkSurroundingSpacesForGearNumbers(col: number, row: number, data: string[]): number[] {
    let numbers = []
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            const targetX = col + x;
            const targetY = row + y;
            if (targetX < 0 || targetX >=  data[row].length) continue
            if (targetY < 0 || targetY >= data.length) continue
            const char = data[targetY][targetX];

            if (!isNumber(char)) continue
            const fullNumber = getFullNumber(targetX, targetY, data)
            numbers.push(Number(fullNumber))
            //Move to end of full number
            for (let i = targetX + 1; i <  data[row].length; i++) {
                const nextChar = data[targetY][i]
                if (!isNumber(nextChar)) break
                x = i
            }
        }
    }
    return numbers
}

function isNumber(char: string) {
    const regExp = new RegExp('[0-9]', 'g')
    return regExp.test(char);
}

function containsSymbol(char: string, target: null | string = null): boolean {
    if (target) return char === target
    return !isNumber(char) && char !== '.'
}

function getFullNumber(col: number, row: number, data: string[]): string {
    let fullNumber = data[row][col]
    //Find end of number
    for (let x = col + 1; x < data[row].length; x++) {
        const nextChar = data[row][x]
        if (!isNumber(nextChar)) break
        fullNumber += nextChar;
    }
    //Find start of number
    for (let x = col - 1; x >= 0; x--) {
        const nextChar = data[row][x]
        if (!isNumber(nextChar)) break
        fullNumber = nextChar + fullNumber;
    }
    return fullNumber
}
