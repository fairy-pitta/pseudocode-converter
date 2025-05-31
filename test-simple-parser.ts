import { IGCSEPseudocodeParser } from './lib/python-igcse/parser-simple';

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

function pythonToIGCSEPseudocode(code: string): string {
  const parser = new IGCSEPseudocodeParser();
  return parser.parse(code);
}

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
console.log(result);

// Compare line by line
const expectedLines = expectedPseudocode.split('\n');
const actualLines = result.split('\n');

console.log('\nLine by line comparison:');
for (let i = 0; i < Math.max(expectedLines.length, actualLines.length); i++) {
  const expected = expectedLines[i] || '';
  const actual = actualLines[i] || '';
  const match = expected === actual ? '✓' : '✗';
  console.log(`Line ${i}: ${match} Expected: "${expected}" | Actual: "${actual}"`);
}

console.log('\nMatch:', expectedPseudocode === result);