"use strict";
// Java to IB Pseudocode Constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGNORED_KEYWORDS = exports.OPERATOR_MAPPING = exports.BOOLEAN_VALUES = exports.KEYWORDS = exports.OPERATORS = void 0;
exports.OPERATORS = {
    ASSIGN: '←',
    EQ: '=',
    NE: '≠',
    LE: '≤',
    GE: '≥',
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
    DIV: 'DIV',
    MOD: 'MOD',
    CONCAT: '+' // String concatenation
};
exports.KEYWORDS = {
    IF: 'if',
    THEN: 'then',
    ELSE_IF: 'else if',
    ELSE: 'else',
    END_IF: 'end if',
    LOOP: 'loop',
    FROM: 'from',
    TO: 'to',
    WHILE: 'while',
    END_LOOP: 'end loop',
    OUTPUT: 'output',
    INPUT: 'input'
};
exports.BOOLEAN_VALUES = {
    TRUE: 'TRUE',
    FALSE: 'FALSE'
};
// Java operators to IB pseudocode mapping
exports.OPERATOR_MAPPING = {
    '==': exports.OPERATORS.EQ,
    '!=': exports.OPERATORS.NE,
    '<=': exports.OPERATORS.LE,
    '>=': exports.OPERATORS.GE,
    '&&': exports.OPERATORS.AND,
    '||': exports.OPERATORS.OR,
    '!': exports.OPERATORS.NOT,
    '/': exports.OPERATORS.DIV, // For integer division
    '%': exports.OPERATORS.MOD
};
// Java keywords to ignore (class declarations, etc.)
exports.IGNORED_KEYWORDS = [
    'class',
    'public',
    'private',
    'protected',
    'static',
    'void',
    'main'
];
