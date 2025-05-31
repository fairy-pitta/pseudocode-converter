"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patterns_1 = require("./lib/python-igcse/patterns");
const testLine = 'student = {"name": "John", "age": 20}';
console.log('Test line:', testLine);
console.log('Dictionary literal pattern:', patterns_1.PATTERNS.DICTIONARY_LITERAL);
console.log('Match result:', testLine.match(patterns_1.PATTERNS.DICTIONARY_LITERAL));
const assignmentMatch = testLine.match(patterns_1.PATTERNS.ASSIGNMENT);
console.log('Assignment pattern match:', assignmentMatch);
