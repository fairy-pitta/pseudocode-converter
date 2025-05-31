const { IBParser } = require('./lib/python-to-pseudocode-parser-ib');

const parser = new IBParser();

const testCases = [
  {
    name: 'for loop over a collection',
    pythonCode: [
      'my_list = [1, 2, 3]',
      'for item in my_list:',
      '  print(item)'
    ].join('\n'),
    expectedPseudocode: [
      'my_list ← [1, 2, 3]',
      'my_list.resetNext()',
      'loop WHILE my_list.hasNext()',
      '    item ← my_list.getNext()',
      'OUTPUT item',
      'end loop'
    ].join('\n')
  },
  {
    name: 'while loop',
    pythonCode: [
      'count = 0',
      'while count < 5:',
      '  print(count)',
      '  count += 1'
    ].join('\n'),
    expectedPseudocode: [
      'count ← 0',
      'WHILE count < 5 DO',
      'OUTPUT count',
      '    count ← count + 1',
      'END WHILE'
    ].join('\n')
  }
];

console.log('Testing for loop over collection and while loop test cases:\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 9}: ${testCase.name}`);
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