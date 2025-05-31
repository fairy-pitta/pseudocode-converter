const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const pythonCode = [
  'class MyClass:',
  '  def __init__(self, value):',
  '    self.value = value',
  '  def get_value(self):',
  '    return self.value'
].join('\n');

const result = parser.parse(pythonCode);
console.log('Actual result:');
console.log(JSON.stringify(result));
console.log('\nActual result (formatted):');
console.log(result);

// Use the actual result as the expected result to see what we're getting
const expectedPseudocode = result;

console.log('\nActual result length:', result.length);
console.log('Expected result length:', expectedPseudocode.length);
console.log('\nActual lines:');
result.split('\n').forEach((line, i) => console.log(`${i}: "${line}"`));
console.log('\nExpected lines:');
expectedPseudocode.split('\n').forEach((line, i) => console.log(`${i}: "${line}"`));

// Show actual result with visible characters
console.log('\nActual result (with visible chars):');
console.log(JSON.stringify(result));

// Check character by character around position 72
console.log('\nCharacter comparison around position 72:');
for (let i = 65; i < 80; i++) {
  const actualChar = result[i] || 'EOF';
  const expectedChar = expectedPseudocode[i] || 'EOF';
  const match = actualChar === expectedChar ? '✓' : '✗';
  console.log(`${i}: actual='${actualChar}' (${actualChar.charCodeAt ? actualChar.charCodeAt(0) : 'N/A'}), expected='${expectedChar}' (${expectedChar.charCodeAt ? expectedChar.charCodeAt(0) : 'N/A'}) ${match}`);
}

console.log('\nExpected result:');
console.log(JSON.stringify(expectedPseudocode));
console.log('\nExpected result (formatted):');
console.log(expectedPseudocode);

console.log('\nAre they equal?', result === expectedPseudocode);