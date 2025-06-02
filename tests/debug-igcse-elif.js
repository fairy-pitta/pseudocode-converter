const { pythonToIGCSEPseudocode } = require('./lib/python-to-pseudocode-parser-igcse');

const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;

console.log('=== Python Code ===');
console.log(pythonCode);
console.log('\n=== Processing ===');
const result = pythonToIGCSEPseudocode(pythonCode);
console.log('\n=== Result ===');
console.log(result);

// Test individual lines
console.log('\n=== Testing individual lines ===');
const lines = pythonCode.split('\n');
lines.forEach((line, index) => {
  console.log(`Line ${index}: "${line}"`);
  if (line.trim().startsWith('elif')) {
    console.log('  -> This is an ELIF line');
  }
  if (line.trim().startsWith('else')) {
    console.log('  -> This is an ELSE line');
  }
});