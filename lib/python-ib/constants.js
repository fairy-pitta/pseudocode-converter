"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCK_TYPES = exports.KEYWORDS = exports.COMPOUND_ASSIGNMENT_OPERATORS = exports.OPERATORS = exports.INDENT_SIZE = void 0;
exports.INDENT_SIZE = 4;
exports.OPERATORS = {
    ASSIGN: '←',
    EQ: '=',
    NE: '≠',
    LE: '≤',
    GE: '≥',
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
    DIV: 'div',
    MOD: 'mod',
    POW: '^',
    CONCAT: '+' // Added for string concatenation
};
exports.COMPOUND_ASSIGNMENT_OPERATORS = [
    { python: '+=', pseudocode: '+' },
    { python: '-=', pseudocode: '-' },
    { python: '*=', pseudocode: '*' },
    { python: '/=', pseudocode: '/' },
    { python: '%=', pseudocode: 'mod' },
    { python: '//=', pseudocode: 'div' },
    { python: '**=', pseudocode: '^' },
];
exports.KEYWORDS = {
    FUNCTION: 'FUNCTION',
    PROCEDURE: 'PROCEDURE',
    CLASS: 'CLASS',
    IF: 'IF',
    THEN: 'THEN',
    ELSE_IF: 'ELSE IF',
    ELSE: 'ELSE',
    END_IF: 'END IF',
    FOR: 'loop',
    FROM: 'from',
    TO: 'to',
    END_FOR: 'end loop',
    WHILE: 'WHILE',
    DO: 'DO',
    END_WHILE: 'END WHILE',
    REPEAT: 'REPEAT',
    UNTIL: 'UNTIL', // Not directly used by current Python parser, but good for completeness
    END_REPEAT: 'end loop', // Python 'repeat' (simulated by while True + break) uses 'end loop'
    CASE_OF: 'CASE OF',
    END_CASE: 'END CASE',
    TRY: 'TRY',
    CATCH: 'CATCH',
    FINALLY: 'FINALLY',
    END_TRY: 'END TRY',
    RETURN: 'RETURN',
    OUTPUT: 'OUTPUT',
    INPUT: 'INPUT',
    DECLARE: 'DECLARE', // Not directly used by Python parser (dynamic typing)
    CONSTANT: 'CONSTANT', // Not directly used by Python parser
    EXTENDS: 'EXTENDS',
    RESET_NEXT: '.resetNext()',
    HAS_NEXT: '.hasNext()',
    GET_NEXT: '.getNext()',
    END_LOOP: 'end loop',
    END_FUNCTION: 'END FUNCTION',
    END_PROCEDURE: 'END PROCEDURE',
    END_CLASS: 'END CLASS',
    INHERITS: 'INHERITS',
};
exports.BLOCK_TYPES = {
    FUNCTION: 'function',
    PROCEDURE: 'procedure',
    CLASS: 'class',
    IF: 'if',
    ELIF: 'elif',
    ELSE: 'else',
    FOR: 'for',
    WHILE: 'while',
    REPEAT: 'repeat',
    CASE: 'case', // For match/case
    TRY: 'try',
    CATCH: 'catch',
    FINALLY: 'finally',
};
