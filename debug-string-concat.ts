import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `greeting = "Hello" + " " + name`;

const expectedPseudocode = `DECLARE greeting : STRING
greeting ← "Hello" & " " & name`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);