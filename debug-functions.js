const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
    name: 'function definition',
    pythonCode: [
      'def greet(name):',
      '  print(f"Hello, {name}")'
    ].join('\n'),
    expectedPseudocode: [
      'FUNCTION greet(name)',
      'OUTPUT "Hello, " + name',
      'END FUNCTION'
    ].join('\n')
  },
  {
    name: 'function definition with return',
    pythonCode: [
      'def add(a, b):',
      '  return a + b'
    ].join('\n'),
    expectedPseudocode: [
      'FUNCTION add(a, b)',
      'RETURN a + b',
      'END FUNCTION'
    ].join('\n')
  }
];

console.log('Testing function definition test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 11}: ${testCase.name}`);
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