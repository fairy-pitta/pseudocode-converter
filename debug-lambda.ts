import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `square = lambda x: x * x
result = square(5)`;

const expectedPseudocode = `FUNCTION Square(x : INTEGER) RETURNS INTEGER
   RETURN x * x
ENDFUNCTION

DECLARE result : INTEGER
result ← Square(5)`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);