import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `if score >= 90:
    print("A")`;

const expectedPseudocode = `IF score ≥ 90 THEN
   OUTPUT "A"
ENDIF`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);