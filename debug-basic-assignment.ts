import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `x = 10
y = "hello"
z = True`;

const expectedPseudocode = `DECLARE x : INTEGER
x ← 10
DECLARE y : STRING
y ← "hello"
DECLARE z : BOOLEAN
z ← TRUE`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);