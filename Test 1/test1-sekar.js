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

/* Find the Sequence based on x value given */
const findTerm = (x) => x * (x + 1) / 2 + 1;

/* Collect all sequences, construct output */
const allTerm = (n) => {
    let res = [];
    for(let i = 0; i < n; i++) {
        res.push(findTerm(i));
    }
    return res.join('-');
}

/* Main function */
async function main() {
    let n = 0;
    
    try {
        // get n value from user input
        n = await input("Input ");
    } catch (err) {
        console.log(err);
    }

    // close read terminal interface
    interface.close();

    console.log("Output: " + allTerm(n));
}

main();