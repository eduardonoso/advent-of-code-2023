const problemHandler = require('../utils/problemHandler.js')

function sumNumbers(data: [], regExp: RegExp): number {

    function extractNumber(s: string) {
        if (!s) return 0
        // @ts-ignore
        const matchIterator = regExp[Symbol.matchAll](s)
        const matches = [];
        for (const match of matchIterator) {
            matches.push(match[1])
        }
        if (!matches.length) return 0

        const str = convertToNumeral(matches[0]) + convertToNumeral(matches[matches.length - 1]);
        return Number(str);
    }

    function convertToNumeral(s: string): string {
        if (!isNaN(Number(s))) return s
        const numeralMap: Object = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9}
        return numeralMap[s as keyof Object].toString()
    }

    return data.map((s: string): number => {
        return extractNumber(s)
    }).reduce((prev: number, curr: number): number => {
        return prev + curr
    });
}

function run(data: []): (number | null)[] {
    const results = [];
    results.push(sumNumbers(data, new RegExp('(?=([0-9]))', 'g')));
    results.push(sumNumbers(data, new RegExp('(?=(one|two|three|four|five|six|seven|eight|nine|zero|[0-9]))', 'g')));
    return results;
}

problemHandler(__filename, run)
