import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `squares = [x*x for x in range(5)]`;

const expectedPseudocode = `DECLARE squares : ARRAY[0:4] OF INTEGER
DECLARE index : INTEGER
index ← 0
FOR x ← 0 TO 4
   squares[index] ← x * x
   index ← index + 1
NEXT x`;

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);