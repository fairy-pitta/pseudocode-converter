"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pythonToIGCSEPseudocode = pythonToIGCSEPseudocode;
exports.IGCSEPseudocodeParser = void 0;

// Import the parser class
const parser_1 = require("./python-igcse/parser");

/**
 * Converts Python code to IGCSE pseudocode format.
 * @param pythonCode The Python source code to convert.
 * @returns The converted IGCSE pseudocode.
 */
function pythonToIGCSEPseudocode(pythonCode) {
    const parser = new parser_1.IGCSEPseudocodeParser();
    return parser.parse(pythonCode);
}

// Re-export the parser class for advanced usage
exports.IGCSEPseudocodeParser = parser_1.IGCSEPseudocodeParser;
