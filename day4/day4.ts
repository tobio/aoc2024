import * as readline from 'readline';
import * as fs from 'fs';

let input = './day4/example';
if (process.env["INPUT"]) {
    input = process.env["INPUT"];
}

function debug(fn: () => void) {
    if(!!process.env["DEBUG"]) {
        fn();
    }
}

const TARGET_WORD = 'XMAS'

interface WordBuilder{
    (row: number, column: number): string | null
}

const builders: WordBuilder[] = [
    buildTraverser(0, 1),
    buildTraverser(0, -1),
    buildTraverser(1, 0),
    buildTraverser(-1, 0),
    buildTraverser(1, 1),
    buildTraverser(1, -1),
    buildTraverser(-1, 1),
    buildTraverser(-1, -1),
]

const file = readline.createInterface({
    input: fs.createReadStream(input),
    terminal: false
});

let chars: string[] = [];
for await (const line of file) {
    chars.push(line);
}

const part1 = chars.flatMap((row, rowIndex) =>
    Array.from(row).flatMap((_, columnIndex) =>
        builders.map(b => b(rowIndex, columnIndex))
    )
).filter(w => w === TARGET_WORD).length;
console.log('Part 1', part1);

const part2 = chars.reduce((sum, row, rowIndex) => {
    return sum + Array.from(row).reduce((sum, _, columnIndex) => {
        const increment = isX_Mas(rowIndex, columnIndex) ? 1 : 0;
        return sum + increment;
    }, 0)
}, 0);
console.log('Part 2', part2);

function buildTraverser(rowIncrement: number, columnIncrement: number): WordBuilder {
    return (row, column) => {
        const maxRow = row + 3*rowIncrement;
        const maxColumn = column + 3*columnIncrement;
        const shouldSkip = maxRow < 0 || maxRow >= chars.length || maxColumn < 0 || maxColumn >= chars[0].length

        if (shouldSkip) return null;

        return [
            chars[row][column],
            chars[row+rowIncrement][column+columnIncrement],
            chars[row+(2*rowIncrement)][column+(2*columnIncrement)],
            chars[row+(3*rowIncrement)][column+(3*columnIncrement)]
        ].join('');
    }
}

function isX_Mas(row: number, column: number): boolean {
    if(row === 0 || column === 0 || row === chars.length - 1 || column === chars[0].length - 1) return false;

    if(chars[row][column] !== 'A') return false;
    const downRight = [chars[row - 1][column - 1], chars[row+1][column+1]];
    const upRight = [chars[row - 1][column + 1], chars[row+1][column-1]];

    const requiredEntries = ['M', 'S'];
    return requiredEntries.every(e => downRight.includes(e) && upRight.includes(e));
}
