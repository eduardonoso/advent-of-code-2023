const problemHandler = require('../utils/problemHandler.js')

problemHandler(__filename, run, ['data'])

function run(data: string[]){
    console.log('data', data)
    const hands = data.map(d => d.split(' ').map(i => i))
    console.log('hands', hands)
    const handTypes = hands.map(hand => {
        return getHandType(hand)
    })
    console.log('handTypes',handTypes)

    handTypes.sort((a,b) => {
        if(a.strength < b.strength) return 1
        if(a.strength > b.strength) return -1
        //Iterate over hand to find best single card
        for(let i=0; i<a.hand.length; i++){
            const cardA = a.hand[i]
            const cardB = b.hand[i]
            if(cardA == cardB) continue
            const cardStrengthA = cardStrength.findIndex(i => i == cardA)
            const cardStrengthB = cardStrength.findIndex(i => i == cardB)
            if(cardStrengthA < cardStrengthB) return -1
            if(cardStrengthA > cardStrengthB) return 1
        }
        return 0
    })
    console.log('handTypes',handTypes)

    const totalWinnings = handTypes.reduce((prev, curr, i) => {
        return prev + curr.bid * (handTypes.length - i)
    }, 0)
    console.log('totalWinnings',totalWinnings)
}

function getHandType(hand: any){
    let cardCounts: any = { counts:{}}
    for(let i = 0; i < hand[0].length; i++){
        const cardInHand = hand[0][i]
        if(!cardCounts.counts.hasOwnProperty(cardInHand)) cardCounts.counts[cardInHand] = 0
        cardCounts.counts[cardInHand] = cardCounts.counts[cardInHand] + 1
    }
    console.log('cardCounts',cardCounts)

   cardCounts.strength = checkCount(0, cardCounts.counts)
   cardCounts.hand = hand[0]
   cardCounts.bid = hand[1]
   console.log('cardCounts',cardCounts)

   return cardCounts
}

function checkCount(highestCount: number, cardCounts: {}){
    for(const [card, count] of Object.entries(cardCounts)){
        console.log(card, count)
        //Check for 2 of a kind, full house
        if(count == 3 && highestCount == 2) return 3.5
        if(count == 2 && highestCount == 3) return 3.5
        if(count == 2 && highestCount == 2)return 2.5
          // @ts-ignore
        if(count < highestCount) continue
          // @ts-ignore
        highestCount = count            
    }
    return highestCount
}

const cardStrength = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const handStrength = ['5','4','F','3','T','2','1']