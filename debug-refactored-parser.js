"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `counter = 5
name = "John"`;
console.log('Input:');
console.log(pythonCode);
console.log('\nOutput:');
console.log((0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode));
console.log('\nExpected:');
console.log('DECLARE counter : INTEGER\ncounter ← 5\nDECLARE name : STRING\nname ← "John"');
