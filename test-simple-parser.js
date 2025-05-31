"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_simple_1 = require("./lib/python-igcse/parser-simple");
var pythonCode = "if score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")";
var expectedPseudocode = "IF score \u2265 90 THEN\n   OUTPUT \"A\"\nELSE\n   IF score \u2265 80 THEN\n      OUTPUT \"B\"\n   ELSE\n      OUTPUT \"C\"\n   ENDIF\nENDIF";
function pythonToIGCSEPseudocode(code) {
    var parser = new parser_simple_1.IGCSEPseudocodeParser();
    return parser.parse(code);
}
var result = pythonToIGCSEPseudocode(pythonCode);
console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
console.log(result);
// Compare line by line
var expectedLines = expectedPseudocode.split('\n');
var actualLines = result.split('\n');
console.log('\nLine by line comparison:');
for (var i = 0; i < Math.max(expectedLines.length, actualLines.length); i++) {
    var expected = expectedLines[i] || '';
    var actual = actualLines[i] || '';
    var match = expected === actual ? '✓' : '✗';
    console.log("Line ".concat(i, ": ").concat(match, " Expected: \"").concat(expected, "\" | Actual: \"").concat(actual, "\""));
}
console.log('\nMatch:', expectedPseudocode === result);
