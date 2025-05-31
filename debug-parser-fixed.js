"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_fixed_1 = require("./lib/python-igcse/parser-fixed");
var pythonCode = "if score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")";
function pythonToIGCSEPseudocode(code) {
    var parser = new parser_fixed_1.IGCSEPseudocodeParser();
    return parser.parse(code);
}
var result = pythonToIGCSEPseudocode(pythonCode);
console.log('Python Code:');
console.log(pythonCode);
console.log('\nResult:');
console.log(result);
console.log('\nResult lines:');
result.split('\n').forEach(function (line, index) {
    console.log("Line ".concat(index, ": \"").concat(line, "\" (length: ").concat(line.length, ")"));
});
