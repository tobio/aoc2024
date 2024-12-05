import * as readline from 'readline';
import * as fs from 'fs';
const input = './day1/input';

const file = readline.createInterface({
    input: fs.createReadStream(input),
    terminal: false
});

const left = Array<number>();
const right = Array<number>();
const rightCounts = new Map<number, number>();

for await (const line of file) {
    const [first, second] = line.split(/\s+/);
    const secondNumber = parseInt(second, 10);
    left.push(parseInt(first, 10));
    right.push(secondNumber);

    rightCounts.set(secondNumber, 1 + (rightCounts.get(secondNumber) || 0))
}

left.sort();
right.sort();

const distances = Array<number>();
const similarities = Array<number>();

left.forEach((item, index) => {
    const distance = item - right[index];
    distances.push(Math.abs(distance));

    const similarity = item * (rightCounts.get(item) || 0);
    similarities.push(similarity);
})

const part1 = distances.reduce((sum, next) => sum + next, 0);
const part2 = similarities.reduce((sum, next) => sum + next);

console.log(part1);
console.log(part2);
