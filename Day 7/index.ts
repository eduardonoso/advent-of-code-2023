const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['data'])

const cardStrength = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const cardStrengthJokers = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

interface Hand {
    counts: CardCount[],
    strength: number,
    wildStrength: number,
    hand: [],
    bid: number
}

interface CardCount {
    count: number,
    card: string
}

function run(data: string[]) {
    let hands: Hand[] = data.map(d => d.split(' ')
        .map(i => i))
        .map(hand => {
            return getHandData(hand)
        })

    // Problem 1
    hands = sortHands(hands, cardStrength)
    const totalWinnings = hands.reduce((prev, curr, i) => {
        return prev + curr.bid * (hands.length - i)
    }, 0)


    // Problem 2
    hands = sortHands(hands, cardStrengthJokers, 'wildStrength')
    const totalWildWinnings = hands.reduce((prev, curr, i) => {
        return prev + curr.bid * (hands.length - i)
    }, 0)

    return [totalWinnings, totalWildWinnings]
}

function sortHands(handTypes: any[], cardStrength: string[], field: string = 'strength'): Hand[] {
    handTypes.sort((a, b) => {
        if (a[field] < b[field]) return 1
        if (a[field] > b[field]) return -1
        //Iterate over hand to find best card in hand position
        for (let i = 0; i < a.hand.length; i++) {
            const cardA = a.hand[i]
            const cardB = b.hand[i]
            if (cardA == cardB) continue
            const cardStrengthA = cardStrength.findIndex(i => i == cardA)
            const cardStrengthB = cardStrength.findIndex(i => i == cardB)
            if (cardStrengthA < cardStrengthB) return -1
            if (cardStrengthA > cardStrengthB) return 1
        }
        return 0
    })
    return handTypes
}

function getHandData(data: any) {
    const counts = getHandCounts(data)
    return {
        hand: data[0],
        bid: data[1],
        strength: getHandStrength(counts),
        wildStrength: getWildHandStrength(counts),
        counts: counts
    }
}

function getHandCounts(data: any) {
    let handCounts = new Map()
    for (let i = 0; i < data[0].length; i++) {
        const cardInHand: string = data[0][i]
        handCounts.set(cardInHand, (handCounts.get(cardInHand) || 0) + 1)
    }
    let sortedCounts: { count: number, card: string }[] = [];
    for (const [card, count] of handCounts.entries()) {
        sortedCounts.push({card, count: Number(count)})
    }
    sortedCounts.sort((a, b) => {
        if (a.count < b.count) return 1
        if (a.count > b.count) return -1
        return 0
    })
    return sortedCounts;
}

function getHandStrength(cardCounts: CardCount[]) {
    let highestCount: number = 0
    for (let i = 0; i < cardCounts.length; i++) {
        const cardCount = cardCounts[i]
        if (cardCount.count == 2 && highestCount == 3) return 3.5 // Full house
        if (cardCount.count == 2 && highestCount == 2) return 2.5 // Two pair
        if (cardCount.count < highestCount) break // Array is sorted so we can bail out
        highestCount = cardCount.count // Highest of a kind
    }
    return highestCount
}

function getWildHandStrength(cardCounts: CardCount[]) {

    const jokerIndex = cardCounts.findIndex(i => i.card === 'J')
    const jokerCount: CardCount = jokerIndex >= 0 ? cardCounts[jokerIndex] : {count: 0, card: 'J'}

    for (let i = 0; i < cardCounts.length; i++) {
        const cardCount = cardCounts[i]
        const withWildCount = cardCount.count + jokerCount.count

        if (cardCount.card == 'J' && cardCounts.length == 1) return cardCount.count // Oops...all Jokers
        if (cardCount.card == 'J') continue // Check next card

        if (withWildCount > 3) return withWildCount // 5 and 4 of a kind

        if (cardCount.count == 3 && cardCounts[i + 1].count == 2) return 3.5 // Full house
        if (cardCount.count + jokerCount.count == 3 && cardCounts[i + 1].count == 2) return 3.5 // Full house

        if (jokerCount.count == 2 && cardCount.count + 1 == 3 && cardCounts[i + 1].count + 1 == 2) return 3.5 // Full house

        if (withWildCount == 3) return withWildCount // Three of a kind

        if (cardCount.count == 2 && cardCounts[i + 1].count == 2) return 2.5 // Two pair
        if (cardCount.count == 2 && cardCounts[i + 1].count + jokerCount.count == 2) return 2.5 // Two pair

        if (jokerCount.count == 1 && cardCount.count == 2 && cardCounts[i + 1].count + 1 == 2) return 2.5 // Two pair
        if (jokerCount.count == 2 && cardCount.count + 1 == 2 && cardCounts[i + 1].count + 1 == 2) return 2.5 // Two pair

        return withWildCount
    }
    return 1
}


