import { IGCSEPseudocodeParser } from './lib/python-igcse/parser-fixed';

function pythonToIGCSEPseudocode(pythonCode: string): string {
  const parser = new IGCSEPseudocodeParser();
  return parser.parse(pythonCode);
}

const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;

const expectedPseudocode = `IF score ≥ 90 THEN
   OUTPUT "A"
ELSE
   IF score ≥ 80 THEN
      OUTPUT "B"
   ELSE
      OUTPUT "C"
   ENDIF
ENDIF`;

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
console.log(result);
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