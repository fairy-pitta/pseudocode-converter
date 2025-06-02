const { pythonToIGCSEPseudocode } = require('./lib/python-to-pseudocode-parser-igcse');

const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;

console.log('Python Code:');
console.log(pythonCode);
console.log('\nIGCSE Pseudocode:');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log(result);

console.log('\nExpected IGCSE Pseudocode:');
const expected = `IF score ≥ 90 THEN
   OUTPUT "A"
   IF score ≥ 80 THEN
      OUTPUT "B"
   ELSE
      OUTPUT "C"
   ENDIF
ENDIF`;
console.log(expected);