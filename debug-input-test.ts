import { IBParser } from './lib/python-to-pseudocode-parser-ib';

const parser = new IBParser();
const pythonCode = 'name = input("Enter your name: ")';
const result = parser.parse(pythonCode);

console.log('Input:', pythonCode);
console.log('Output:', result);
console.log('Expected: INPUT name');
console.log('Match:', result === 'INPUT name');