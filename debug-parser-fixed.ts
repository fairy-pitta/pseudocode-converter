import { IGCSEPseudocodeParser } from './lib/python-igcse/parser-fixed';

const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;

function pythonToIGCSEPseudocode(code: string): string {
  const parser = new IGCSEPseudocodeParser();
  return parser.parse(code);
}

const result = pythonToIGCSEPseudocode(pythonCode);

console.log('Python Code:');
console.log(pythonCode);
console.log('\nResult:');
console.log(result);
console.log('\nResult lines:');
result.split('\n').forEach((line, index) => {
  console.log(`Line ${index}: "${line}" (length: ${line.length})`);
});