const { IBParser } = require('./lib/python-to-pseudocode-parser-ib.js');

const parser = new IBParser();

const pythonCode = [
  'try:',
  '  x = 1 / 0',
  'except ZeroDivisionError:',
  '  print("Cannot divide by zero")',
  'finally:',
  '  print("Execution finished")'
].join('\n');

const result = parser.parse(pythonCode);
console.log('Actual result:');
console.log(JSON.stringify(result));
console.log('\nActual result (formatted):');
console.log(result);

const expectedPseudocode = [
  'TRY',
  '  x ← 1 / 0',
  'CATCH ZeroDivisionError',
  '  OUTPUT "Cannot divide by zero"',
  'FINALLY',
  '  OUTPUT "Execution finished"',
  'END TRY'
].join('\n');

console.log('\nExpected result:');
console.log(JSON.stringify(expectedPseudocode));
console.log('\nExpected result (formatted):');
console.log(expectedPseudocode);

console.log('\nAre they equal?', result === expectedPseudocode);