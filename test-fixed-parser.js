"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_fixed_1 = require("./lib/python-igcse/parser-fixed");
function pythonToIGCSEPseudocode(pythonCode) {
    var parser = new parser_fixed_1.IGCSEPseudocodeParser();
    return parser.parse(pythonCode);
}
var pythonCode = "if score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")";
var expectedPseudocode = "IF score \u2265 90 THEN\n   OUTPUT \"A\"\nELSE\n   IF score \u2265 80 THEN\n      OUTPUT \"B\"\n   ELSE\n      OUTPUT \"C\"\n   ENDIF\nENDIF";
var result = pythonToIGCSEPseudocode(pythonCode);
console.log('Python Code:');
console.log(pythonCode);
console.log('\nExpected:');
console.log(expectedPseudocode);
console.log('\nActual:');
console.log(result);
console.log('\nLine by line comparison:');
var expectedLines = expectedPseudocode.split('\n');
var actualLines = result.split('\n');
var maxLines = Math.max(expectedLines.length, actualLines.length);
for (var i = 0; i < maxLines; i++) {
    var expected = expectedLines[i] || '<missing>';
    var actual = actualLines[i] || '<missing>';
    var match = expected === actual;
    console.log("Line ".concat(i, ": ").concat(match ? '✓' : '✗', " Expected: \"").concat(expected, "\" | Actual: \"").concat(actual, "\""));
}
console.log('\nMatch:', result === expectedPseudocode);
