import * as readline from 'readline';
import * as fs from 'fs';

let input = './day2/example';
if (process.env["INPUT"]) {
    input = process.env["INPUT"];
}

const file = readline.createInterface({
    input: fs.createReadStream(input),
    terminal: false
});

const validReports = Array<number[]>();
const validDampenedReports = Array<number[]>();
for await (const line of file) {
    const levels = line.split(/\s+/).map(i => parseInt(i, 10));

    function checkValidity(levels: number[]): {isValid: boolean, firstFailingIndex: number} {
        let expectIncreasing: boolean;

        let firstFailingIndex = 0;
        const isValid = levels.every((current, index, levels) => {
            if(index === 0) {
                expectIncreasing = current < levels[index + 1];
                return true
            }

            const previous = levels[index - 1];
            const diff = current - previous;

            const isIncreasing = diff > 0;
            if (expectIncreasing != isIncreasing) {
                firstFailingIndex = index;
                return false;
            }

            const absDiff = Math.abs(diff);
            if (absDiff < 1 || absDiff > 3) {
                firstFailingIndex = index;
                return false;
            }

            return true;
        });

        return {isValid, firstFailingIndex};
    }

    const {isValid, firstFailingIndex} = checkValidity(levels);
    if (isValid) {
        validReports.push(levels);
    } else {
        levels.every((_, index) => {
            const dampedLevels = [...levels];
            dampedLevels.splice(index, 1);
            const {isValid} = checkValidity(dampedLevels);
            if(isValid) {
                validDampenedReports.push(levels);
                return false;
            }

            return true;
        })
    }
}

console.log(validReports.length);
console.log(validReports.length + validDampenedReports.length);
// console.log(validDampenedReports);
