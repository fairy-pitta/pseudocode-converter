import { PATTERNS } from './lib/python-igcse/patterns';

const testLine = 'student = {"name": "John", "age": 20}';
console.log('Test line:', testLine);
console.log('Dictionary literal pattern:', PATTERNS.DICTIONARY_LITERAL);
console.log('Match result:', testLine.match(PATTERNS.DICTIONARY_LITERAL));

const assignmentMatch = testLine.match(PATTERNS.ASSIGNMENT);
console.log('Assignment pattern match:', assignmentMatch);