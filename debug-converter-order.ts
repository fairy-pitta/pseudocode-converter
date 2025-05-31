import { pythonToIGCSEPseudocode } from './lib/python-to-pseudocode-parser-igcse-refactored';
import { PATTERNS } from './lib/python-igcse/patterns';
import { expressionConverters } from './lib/python-igcse/converters/expressions';

const testLine = 'student = {"name": "John", "age": 20}';
console.log('Test line:', testLine);

// Test dictionary literal pattern
const dictMatch = testLine.match(PATTERNS.DICTIONARY_LITERAL);
console.log('Dictionary literal match:', dictMatch);

// Test assignment pattern
const assignMatch = testLine.match(PATTERNS.ASSIGNMENT);
console.log('Assignment match:', assignMatch);

// Test dictionary converter directly
const state = { declarations: new Set<string>(), indentationLevels: [0], currentBlockTypes: [], outputLines: [] };
const dictResult = expressionConverters.convertDictionaryLiteral(testLine, '', state);
console.log('Dictionary converter result:', dictResult);

// Test assignment converter
const assignResult = expressionConverters.convertAssignment(testLine, '', state);
console.log('Assignment converter result:', assignResult);

// Test full conversion
const fullResult = pythonToIGCSEPseudocode(testLine);
console.log('Full conversion result:');
console.log(fullResult);