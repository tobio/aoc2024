import * as readline from 'readline';
import * as fs from 'fs';

let input = './day5/example';
if (process.env["INPUT"]) {
    input = process.env["INPUT"];
}

function debug(fn: () => void) {
    if(!!process.env["DEBUG"]) {
        fn();
    }
}

const file = readline.createInterface({
    input: fs.createReadStream(input),
    terminal: false
});

const ordering = new Map<number, number[]>();
const updates: number[][] = [];

for await (const line of file) {
    if(line.length === 0) break;

    const [first, second] = line.split('|').map(s => parseInt(s, 10));

    let order: number[] = [];
    if(ordering.has(first)) {
        order = ordering.get(first)
    }

    order.push(second);
    ordering.set(first, order);
}

for await (const line of file) {
    updates.push(line.split(',').map(i => parseInt(i, 10)));
}

const updatesWithValidity = updates.map(u => ({
    update: u,
    isValid: isValid(u)
}));

const validUpdates = updatesWithValidity.filter(u => u.isValid).map(u => u.update);
debug(() => console.error(JSON.stringify(validUpdates)));

const part1 = sumUpdates(validUpdates)
console.log('Part 1', part1);

const invalidUpdates = updatesWithValidity.filter(u => !u.isValid).map(u => u.update);
const fixedUpdates = invalidUpdates.map(makeValid);
debug(() => console.error(JSON.stringify(fixedUpdates)));

const part2 = sumUpdates(fixedUpdates)
console.log('Part 2', part2);

function sumUpdates(updates: number[][]): number {
    return updates.reduce((sum, update) => {
        const middlePage = update[Math.floor(update.length / 2)];
        return sum + middlePage;
    }, 0);
}

function isValid(update: number[]): boolean {
    const preceedingPages = new Set<number>();

    return update.every(page => {
        // If there are no ordering rules for this page then it's valid
        if(!ordering.has(page)){
            preceedingPages.add(page);
            return true;
        }

        const mustNotPreceed = ordering.get(page);
        const satisfiesRules = !mustNotPreceed.some(p => preceedingPages.has(p));

        preceedingPages.add(page);
        return satisfiesRules;
    })
}

function makeValid(update: number[]): number[] {
    const validUpdate = [...update];
    validUpdate.sort((left, right) => {
        const requiredOrder = ordering.get(left);
        if(requiredOrder && requiredOrder.includes(right)) return -1;

        return 0;
    });

    return validUpdate;
}
