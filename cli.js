#!/usr/bin/env node

import { saveInput, readDirectory } from './src/actions.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
    switch (command) {
        case 'save':
            await saveInput();
            break;
            
        case 'read':
            const targetDir = args[1] || '.';
            await readDirectory(targetDir);
            break;
            
        default:
            console.log(`
🚀 Interpreter CLI

Usage:
  node cli.js save           Interactive prompt to save text to a file.
  node cli.js read <dir>     Read all files in <dir> and print their content.

Example:
  node cli.js save
  node cli.js read ./src
            `);
            break;
    }
}

main().catch(err => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
});
