/* Read terminal input */
const interface = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

/* Input function */
function input(q) {
    return new Promise(resolve => {
        interface.question(q, data => {
            return resolve(data);
        });
    });
}

/* Set rank */
const denseRank = (scores, playerScores) => {
    const playerRanks = [];
    const unqScores = [...new Set(scores)]; // remove duplicat value
    let pos = unqScores.length - 1; // rank position
    for(let pScore of playerScores) {
        while(pos >= 0) {
            if(pScore >= unqScores[pos]) pos--; // move rank up
            else {
                playerRanks.push(pos + 2); // move rank down // (pos + 2) is equal to (score length + 1)
                break;
            }
        }
        if(pos < 0) playerRanks.push(1); // if there are no bigger value again, the rank is 1
    }
    return playerRanks.join(' ');
}

async function main() {
    let n = 0, m = 0;
    let gameScores = [];
    let playerScores = [];
    let temp = "";
    
    // get user input
    try {
        n = await input("");
    } catch (err) {
        console.log(err);
    }

    try {
        temp = await input("");
        gameScores = temp.split(' ').map(Number); // convert string into array of number
    } catch (err) {
        console.log(err);
    }

    try {
        m = await input("");
    } catch (err) {
        console.log(err);
    }

    try {
        temp = await input("");
        playerScores = temp.split(' ').map(Number); // convert string into array of number
    } catch (err) {
        console.log(err);
    }

    interface.close(); // close terminal read

    console.log(denseRank(gameScores, playerScores));
}

main();