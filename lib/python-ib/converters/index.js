"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CONVERTERS = void 0;
const control_flow_1 = require("./control-flow");
const declarations_1 = require("./declarations");
const expressions_1 = require("./expressions");
exports.ALL_CONVERTERS = [
    // Order matters: More specific patterns should come before general ones.
    // Example: ELIF before IF if they shared a common prefix (they don't here, but as a principle)
    // Example: Compound assignment before simple assignment
    // Control Flow - specific keywords first
    control_flow_1.controlFlowConverters.convertRepeat, // Must be before WHILE to catch '# repeat' with 'while True'
    control_flow_1.controlFlowConverters.convertElif,
    control_flow_1.controlFlowConverters.convertElse,
    control_flow_1.controlFlowConverters.convertIf,
    control_flow_1.controlFlowConverters.convertForRange,
    control_flow_1.controlFlowConverters.convertForCollection,
    control_flow_1.controlFlowConverters.convertWhile,
    control_flow_1.controlFlowConverters.convertTry,
    control_flow_1.controlFlowConverters.convertExcept,
    control_flow_1.controlFlowConverters.convertFinally,
    // Declarations
    declarations_1.declarationConverters.convertFunctionDef,
    declarations_1.declarationConverters.convertClassDef,
    // Expressions & Statements - specific keywords/patterns first
    expressions_1.expressionConverters.convertReturn,
    expressions_1.expressionConverters.convertPrint, // Before assignment, as print() is specific
    // Input is handled within convertAssignment for now
    expressions_1.expressionConverters.convertCompoundAssignment, // Before simple assignment
    expressions_1.expressionConverters.convertAssignment,
    expressions_1.expressionConverters.convertStandaloneExpression, // For function calls etc. not assigned
];
