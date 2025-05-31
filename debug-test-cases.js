const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
    name: 'simple assignment',
    pythonCode: 'x = 10',
    expectedPseudocode: 'x ← 10'
  },
  {
    name: 'print statement',
    pythonCode: 'print("Hello, World!")',
    expectedPseudocode: 'OUTPUT "Hello, World!"'
  },
  {
    name: 'input statement',
    pythonCode: 'name = input("Enter your name: ")',
    expectedPseudocode: 'INPUT name'
  },
  {
    name: 'if statement',
    pythonCode: [
      'if x > 5:',
      '  print("Greater")'
    ].join('\n'),
    expectedPseudocode: [
      'IF x > 5 THEN',
      'OUTPUT "Greater"',
      'END IF'
    ].join('\n')
  }
];

console.log('Testing first 4 test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
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