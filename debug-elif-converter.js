const { convertElif } = require('./lib/python-igcse/converters/control-flow');
const { PATTERNS } = require('./lib/python-igcse/patterns');

// Test the ELIF pattern
const testLine = 'elif score >= 80:';
console.log('Testing line:', testLine);
console.log('ELIF pattern:', PATTERNS.ELIF);
console.log('Pattern match:', testLine.match(PATTERNS.ELIF));

// Test the converter directly
const result = convertElif(testLine, '', {});
console.log('Converter result:', result);

// Test with indentation
const indentedResult = convertElif(testLine, '   ', {});
console.log('Converter result with indentation:', indentedResult);