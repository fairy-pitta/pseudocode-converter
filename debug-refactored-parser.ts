import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `counter = 5
name = "John"`;

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(pythonToIGCSEPseudocode(pythonCode));
console.log('\nExpected:');
console.log('DECLARE counter : INTEGER\ncounter ← 5\nDECLARE name : STRING\nname ← "John"');