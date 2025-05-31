const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCase = {
  name: 'class definition',
  pythonCode: [
    'class MyClass:',
    '  def __init__(self, value):',
    '    self.value = value',
    '  def get_value(self):',
    '    return self.value'
  ].join('\n'),
  expectedPseudocode: [
    'CLASS MyClass',
    '  FUNCTION __init__(self, value)',
    '    self.value ← value',
    '  END FUNCTION',
    '  FUNCTION get_value(self)',
    '    RETURN self.value',
    '  END FUNCTION'
  ].join('\n')
};

console.log('Testing class definition test case:\n');
console.log('Python code:', JSON.stringify(testCase.pythonCode));

const result = parser.parse(testCase.pythonCode);
console.log('Actual result:', JSON.stringify(result));
console.log('Expected result:', JSON.stringify(testCase.expectedPseudocode));

const isEqual = result === testCase.expectedPseudocode;
console.log('✓ Pass:', isEqual);

if (!isEqual) {
  console.log('\nActual (formatted):');
  console.log(result);
  console.log('\nExpected (formatted):');
  console.log(testCase.expectedPseudocode);
  
  // Character by character comparison
  console.log('\nCharacter comparison:');
  const actualChars = result.split('');
  const expectedChars = testCase.expectedPseudocode.split('');
  const maxLen = Math.max(actualChars.length, expectedChars.length);
  
  for (let i = 0; i < Math.min(maxLen, 200); i++) {
    const actualChar = actualChars[i] || 'EOF';
    const expectedChar = expectedChars[i] || 'EOF';
    if (actualChar !== expectedChar) {
      console.log(`Diff at position ${i}: actual='${actualChar}' (${actualChar.charCodeAt ? actualChar.charCodeAt(0) : 'N/A'}), expected='${expectedChar}' (${expectedChar.charCodeAt ? expectedChar.charCodeAt(0) : 'N/A'})`);
      break;
    }
  }
}