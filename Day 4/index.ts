const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run)

function run(data: []): number[] {
    const results: number[] = [];
    let result = processData(data);
    results.push(result.totalPoints)
    results.push(result.totalCards)
    return results;
}

interface Card {
    name: string,
    winningNumbers: string[],
    numbers: string[],
    matches: string[],
    copies: number
}

function processData(data: string[]) {
    const cards: Card[] = data.map((d): Card => {
        const splitCard: string[] = d.split(':');
        const splitNumbers = splitCard[1].trim().split('| ')
        const numbers = splitNumbers[1].split(' ').filter(s => {
            if (s !== '') return s
        })
        const winningNumbers = splitNumbers[0].split(' ').filter(s => {
            if (s !== '') return s
        })
        return {
            name: splitCard[0],
            copies: 1,
            numbers,
            winningNumbers,
            matches: numbers.filter(n => winningNumbers.includes(n))
        }
    })

    const totalPoints = cards.reduce((prev, curr) => {
        return prev + calculatePoints(curr)
    }, 0)

    cards.forEach((card, index) => {
        if (!card.matches.length) return
        for (let i = 1; i <= card.matches.length; i++) {
            cards[index + i].copies += card.copies
        }
    })

    const totalCards = cards.reduce((prev, curr) => {
        return prev + curr.copies
    }, 0);

    return {
        totalPoints,
        totalCards
    }
}

function calculatePoints(card: Card) {
    if (card.matches.length === 0) return 0
    let points = 1
    for (let i = 0; i < card.matches.length - 1; i++) {
        points *= 2
    }
    return points
}
