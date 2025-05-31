import { IBParser } from './lib/python-to-pseudocode-parser-ib.js';

const parser = new IBParser();
const pythonCode = 'name = input("Enter your name: ")';
const result = parser.parse(pythonCode);

console.log('Input:', pythonCode);
console.log('Output:', result);
console.log('Expected: INPUT name');