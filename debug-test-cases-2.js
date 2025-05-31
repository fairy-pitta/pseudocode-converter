const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
    name: 'if-else statement',
    pythonCode: `if x > 5:
  print("Greater")
else:
  print("Smaller or Equal")`,
    expectedPseudocode: `IF x > 5 THEN
OUTPUT "Greater"
    ELSE
    OUTPUT "Smaller OR Equal"
END IF`
  },
  {
    name: 'if-elif-else statement',
    pythonCode: [
      'if x > 10:',
      '  print("Greater than 10")',
      'elif x > 5:',
      '  print("Greater than 5")',
      'else:',
      '  print("Smaller or Equal to 5")'
    ].join('\n'),
    expectedPseudocode: [
      'IF x > 10 THEN',
      '  OUTPUT "Greater than 10"',
      'ELSE IF x > 5 THEN',
      '  OUTPUT "Greater than 5"',
      'ELSE',
      '  OUTPUT "Smaller or Equal to 5"',
      'END IF'
    ].join('\n')
  }
];

console.log('Testing if-else and if-elif-else test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 5}: ${testCase.name}`);
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
    
    for (let i = 0; i < Math.min(maxLen, 100); i++) {
      const actualChar = actualChars[i] || 'EOF';
      const expectedChar = expectedChars[i] || 'EOF';
      if (actualChar !== expectedChar) {
        console.log(`Diff at position ${i}: actual='${actualChar}' (${actualChar.charCodeAt ? actualChar.charCodeAt(0) : 'N/A'}), expected='${expectedChar}' (${expectedChar.charCodeAt ? expectedChar.charCodeAt(0) : 'N/A'})`);
        break;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});