"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const patterns_1 = require("./lib/python-igcse/patterns");
const expressions_1 = require("./lib/python-igcse/converters/expressions");
const testLine = 'student = {"name": "John", "age": 20}';
console.log('Test line:', testLine);
// Test dictionary literal pattern
const dictMatch = testLine.match(patterns_1.PATTERNS.DICTIONARY_LITERAL);
console.log('Dictionary literal match:', dictMatch);
// Test assignment pattern
const assignMatch = testLine.match(patterns_1.PATTERNS.ASSIGNMENT);
console.log('Assignment match:', assignMatch);
// Test dictionary converter directly
const state = { declarations: new Set(), indentationLevels: [0], currentBlockTypes: [], outputLines: [] };
const dictResult = expressions_1.expressionConverters.convertDictionaryLiteral(testLine, '', state);
console.log('Dictionary converter result:', dictResult);
// Test assignment converter
const assignResult = expressions_1.expressionConverters.convertAssignment(testLine, '', state);
console.log('Assignment converter result:', assignResult);
// Test full conversion
const fullResult = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(testLine);
console.log('Full conversion result:');
console.log(fullResult);
