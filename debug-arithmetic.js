"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `result = a + b - c * d / e
remainder = x % y
quotient = x // y`;
const expectedPseudocode = `DECLARE result : REAL
result ← a + b - c * d / e
DECLARE remainder : INTEGER
remainder ← x MOD y
DECLARE quotient : INTEGER
quotient ← x DIV y`;
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log(result);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nMatch:', result === expectedPseudocode);
