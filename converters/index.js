"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CONVERTERS = void 0;
var control_flow_1 = require("./control-flow");
var declarations_1 = require("./declarations");
var expressions_1 = require("./expressions");
exports.ALL_CONVERTERS = [
    // Order matters: More specific patterns should come before general ones.
    // Control Flow - specific keywords first
    control_flow_1.controlFlowConverters.convertIf,
    control_flow_1.controlFlowConverters.convertElif,
    control_flow_1.controlFlowConverters.convertElse,
    control_flow_1.controlFlowConverters.convertForRange,
    control_flow_1.controlFlowConverters.convertForCollection,
    control_flow_1.controlFlowConverters.convertWhile,
    // Declarations
    declarations_1.declarationConverters.convertFunctionDef,
    declarations_1.declarationConverters.convertClassDef,
    // Expressions & Statements - specific keywords/patterns first
    expressions_1.expressionConverters.convertPrint,
    expressions_1.expressionConverters.convertReturn,
    expressions_1.expressionConverters.convertConstant, // Before assignment
    expressions_1.expressionConverters.convertLambda, // Before simple assignment
    expressions_1.expressionConverters.convertListComprehension, // Before simple assignment
    expressions_1.expressionConverters.convertMultipleAssignment, // Before simple assignment
    expressions_1.expressionConverters.convertDictionaryLiteral, // Before simple assignment
    expressions_1.expressionConverters.convertDictionaryAssignment, // Before simple assignment
    expressions_1.expressionConverters.convertCompoundAssignment, // Before simple assignment
    expressions_1.expressionConverters.convertAssignment,
];
__exportStar(require("./control-flow"), exports);
__exportStar(require("./declarations"), exports);
__exportStar(require("./expressions"), exports);
