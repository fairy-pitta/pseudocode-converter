import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `is_valid = True
is_empty = False
result = is_valid and not is_empty`;

const expectedPseudocode = `DECLARE is_valid : BOOLEAN
is_valid ← TRUE
DECLARE is_empty : BOOLEAN
is_empty ← FALSE
DECLARE result : BOOLEAN
result ← is_valid AND NOT is_empty`;

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);