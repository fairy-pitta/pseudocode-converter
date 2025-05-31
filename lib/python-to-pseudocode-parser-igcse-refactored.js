"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGCSEPseudocodeParser = void 0;
exports.pythonToIGCSEPseudocode = pythonToIGCSEPseudocode;
var parser_1 = require("./python-igcse/parser");
/**
 * Converts Python code to IGCSE pseudocode format.
 * @param pythonCode The Python source code to convert.
 * @returns The converted IGCSE pseudocode.
 */
function pythonToIGCSEPseudocode(pythonCode) {
    var parser = new parser_1.IGCSEPseudocodeParser();
    return parser.parse(pythonCode);
}
// Re-export the parser class for advanced usage
var parser_2 = require("./python-igcse/parser");
Object.defineProperty(exports, "IGCSEPseudocodeParser", { enumerable: true, get: function () { return parser_2.IGCSEPseudocodeParser; } });
