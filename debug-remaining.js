const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
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
  },
  {
    name: 'comments',
    pythonCode: [
      '# This is a comment',
      'x = 10  # Another comment'
    ].join('\n'),
    expectedPseudocode: [
      '// This is a comment',
      'x ← 10 # Another comment'
    ].join('\n')
  },
  {
    name: 'try-except block',
    pythonCode: [
      'try:',
      '  x = 1 / 0',
      'except ZeroDivisionError:',
      '  print("Cannot divide by zero")'
    ].join('\n'),
    expectedPseudocode: [
      'TRY',
      '  x ← 1 / 0',
      'CATCH ZeroDivisionError',
      '  OUTPUT "Cannot divide by zero"',
      'END TRY'
    ].join('\n')
  },
  {
    name: 'try-except-finally block',
    pythonCode: [
      'try:',
      '  x = 1 / 0',
      'except ZeroDivisionError:',
      '  print("Cannot divide by zero")',
      'finally:',
      '  print("Execution finished")'
    ].join('\n'),
    expectedPseudocode: [
      'TRY',
      '  x ← 1 / 0',
      'CATCH ZeroDivisionError',
      '  OUTPUT "Cannot divide by zero"',
      'FINALLY',
      '  OUTPUT "Execution finished"',
      'END TRY'
    ].join('\n')
  }
];

console.log('Testing remaining test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 13}: ${testCase.name}`);
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