import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `result = x > y and a <= b and c != d and e == f`;
const expectedPseudocode = `DECLARE result : BOOLEAN
result ← x > y AND a ≤ b AND c ≠ d AND e = f`;

console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);
console.log('\nMatch:', result === expectedPseudocode);