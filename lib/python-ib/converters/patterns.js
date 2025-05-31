"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATTERNS = void 0;
exports.PATTERNS = {
    COMMENT: /^#.*/,
    FUNCTION_DEF: /^def\s+(\w+)\((.*?)\)\s*:/,
    PROCEDURE_COMMENT: /#\s*procedure/i,
    CLASS_DEF: /^class\s+(\w+)(?:\((\w+)\))?\s*:/,
    IF: /^if\s+(.+?)\s*:/,
    ELIF: /^elif\s+(.+?)\s*:/,
    ELSE: /^else\s*:/,
    FOR_RANGE: /^(?:async\s+)?for\s+(\w+)\s+in\s+range\(([^)]*)\)\s*:/,
    FOR_COLLECTION: /^(?:async\s+)?for\s+(\w+)\s+in\s+([^:]+?)\s*:/,
    WHILE: /^while\s+(.+?)\s*:/,
    REPEAT_COMMENT: /#\s*repeat/i, // Used to identify `while True:` loops that should be REPEAT
    MATCH: /^match\s+(.+?)\s*:/,
    CASE: /^case\s+(.+?)\s*:/,
    TRY: /^try\s*:/,
    EXCEPT: /^except(?:\s+([^:]+?))?\s*:/,
    FINALLY: /^finally\s*:/,
    RETURN: /^return(?:\s+(.*))?/,
    PRINT: /^print\((.*)\)/,
    INPUT: /(\w+)\s*=\s*input(?:\((?:"(?:.*?)"|'(?:.*?)')?\))?/,
    // Basic assignment, careful not to match comparisons or parts of other statements
    ASSIGNMENT: /^(\w+(?:\.\w+)*)\s*=\s*(.+)/,
    // Compound assignments: x += 1, y -= 2 etc.
    COMPOUND_ASSIGNMENT: /^(\w+(?:\.\w+)*)\s*(\*\*|\/\/|\+|\-|\*|\/|%|&|\||\^)=\s*(.+)$/,
    // Standalone expressions (e.g. function calls not assigned to variables)
    STANDALONE_EXPRESSION: /^\w+\(.*\)/,
};
