const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
    name: 'for loop with range',
    pythonCode: [
      'for i in range(5):',
      '  print(i)'
    ].join('\n'),
    expectedPseudocode: [
      'loop i from 0 to 4',
      'OUTPUT i',
      'end loop'
    ].join('\n')
  },
  {
    name: 'for loop with range and step',
    pythonCode: [
      'for i in range(0, 10, 2):',
      '  print(i)'
    ].join('\n'),
    expectedPseudocode: [
      'loop i from 0 to 9',
      'OUTPUT i',
      'end loop'
    ].join('\n')
  }
];

console.log('Testing for loop test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 7}: ${testCase.name}`);
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
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});