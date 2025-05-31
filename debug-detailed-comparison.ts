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

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(JSON.stringify(expectedPseudocode));
console.log('\nActual:');
console.log(JSON.stringify(result));
console.log('\nExpected lines:');
expectedPseudocode.split('\n').forEach((line, i) => {
  console.log(`${i}: "${line}"`);
});
console.log('\nActual lines:');
result.split('\n').forEach((line, i) => {
  console.log(`${i}: "${line}"`);
});
console.log('\nLine by line comparison:');
const expectedLines = expectedPseudocode.split('\n');
const actualLines = result.split('\n');
const maxLines = Math.max(expectedLines.length, actualLines.length);
for (let i = 0; i < maxLines; i++) {
  const expected = expectedLines[i] || '<missing>';
  const actual = actualLines[i] || '<missing>';
  const match = expected === actual;
  console.log(`Line ${i}: ${match ? '✓' : '✗'} Expected: "${expected}" | Actual: "${actual}"`);
}
console.log('\nMatch:', result === expectedPseudocode);