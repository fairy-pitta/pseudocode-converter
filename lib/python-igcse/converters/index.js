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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CONVERTERS = void 0;
const control_flow_1 = require("./control-flow");
const declarations_1 = require("./declarations");
const expressions_1 = require("./expressions");
const errorHandlingConverters = __importStar(require("./error-handling"));
const listConverters = __importStar(require("./lists"));
exports.ALL_CONVERTERS = [
    // Order matters: More specific patterns should come before general ones.
    // Control Flow - specific keywords first
    control_flow_1.controlFlowConverters.convertIf,
    control_flow_1.controlFlowConverters.convertElif,
    control_flow_1.controlFlowConverters.convertElse,
    control_flow_1.controlFlowConverters.convertForRange,
    control_flow_1.controlFlowConverters.convertForCollection,
    control_flow_1.controlFlowConverters.convertWhile,
    control_flow_1.controlFlowConverters.convertBreak,
    control_flow_1.controlFlowConverters.convertContinue,
    // Error Handling
    errorHandlingConverters.convertTry,
    errorHandlingConverters.convertExcept,
    errorHandlingConverters.convertFinally,
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
    // List operations - before general assignment
    listConverters.convertListDeclaration,
    listConverters.convertListAssignment,
    listConverters.convertListAccess,
    expressions_1.expressionConverters.convertCompoundAssignment, // Before simple assignment
    expressions_1.expressionConverters.convertAssignment,
];
__exportStar(require("./control-flow"), exports);
__exportStar(require("./declarations"), exports);
__exportStar(require("./expressions"), exports);
__exportStar(require("./lists"), exports);
