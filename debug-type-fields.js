"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_to_pseudocode_parser_igcse_refactored_1 = require("./lib/python-to-pseudocode-parser-igcse-refactored");
const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;
console.log('Testing type fields tracking...');
console.log('Python code:', pythonCode);
const result = (0, python_to_pseudocode_parser_igcse_refactored_1.pythonToIGCSEPseudocode)(pythonCode);
console.log('\nResult:');
console.log(result);
