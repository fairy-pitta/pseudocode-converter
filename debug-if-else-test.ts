import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';

const pythonCode = `if score >= 50:
    print("Pass")
else:
    print("Fail")`;
const expectedPseudocode = `IF score ≥ 50 THEN
   OUTPUT "Pass"
ELSE
   OUTPUT "Fail"
ENDIF`;

console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);
console.log('\nMatch:', result === expectedPseudocode);