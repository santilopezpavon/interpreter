#!/usr/bin/env node
import { runRpc, callRPC } from './src/rpc.js';
import { analyzeDirectory , apllyChanges} from './src/analyzer.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'rpc':
      await runRpc();
      break;

    case 'analyze':
      await analyzeDirectory();
      break;

    case 'creator':
      await callRPC();
      break;

    case 'analyze-apply':
      await apllyChanges();
      break;
    default:
      console.log(`
🚀 Interpreter CLI

Available commands:

  npm start creator
      Creates a prompt in the clipboard for the AI to return a JSON-RPC response.

  npm start rpc
      Reads a JSON-RPC from the clipboard and executes the actions.

  npm start analyze
      Generates a prompt with the directory's code content for analysis.

  npm start analyze-apply
      Generates a prompt to request the application of analysis improvements via JSON-RPC.
`);
      break;
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
