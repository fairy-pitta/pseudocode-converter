import { controlFlowConverters } from './control-flow';
import { declarationConverters } from './declarations';
import { expressionConverters } from './expressions';
import * as errorHandlingConverters from './error-handling';
import * as listConverters from './lists';
import { objectOrientedConverters } from './object-oriented';
import { fileOperationConverters } from './file-operations';
import { ConverterFunction } from '../types';

export const ALL_CONVERTERS: ConverterFunction[] = [
  // Order matters: More specific patterns should come before general ones.
  
  // File Operations - very specific patterns first
  fileOperationConverters.convertWithOpen,
  fileOperationConverters.convertFileWrite,
  fileOperationConverters.convertFileRead,
  fileOperationConverters.convertFileIteration,
  fileOperationConverters.convertSimpleOpen,
  
  // Control Flow - specific keywords first
  controlFlowConverters.convertIf,
  controlFlowConverters.convertElif,
  controlFlowConverters.convertElse,
  controlFlowConverters.convertForRange,
  controlFlowConverters.convertForCollection,
  controlFlowConverters.convertWhile,
  controlFlowConverters.convertBreak,
  controlFlowConverters.convertContinue,

  // Error Handling
  errorHandlingConverters.convertTry,
  errorHandlingConverters.convertExcept,
  errorHandlingConverters.convertFinally,

  // Declarations
  declarationConverters.convertFunctionDef,
  declarationConverters.convertClassDef,
  declarationConverters.convertConstructorDef,
  
  // Expressions & Statements - specific keywords/patterns first
  expressionConverters.convertPrint,
  expressionConverters.convertReturn,
  expressionConverters.convertConstant, // Before assignment
  expressionConverters.convertLambda, // Before simple assignment
  expressionConverters.convertListComprehension, // Before simple assignment
  expressionConverters.convertMultipleAssignment, // Before simple assignment
  expressionConverters.convertDictionaryLiteral, // Before simple assignment
  expressionConverters.convertDictionaryAssignment, // Before simple assignment

  // List operations - before general assignment
  listConverters.convertListDeclaration,
  listConverters.convertListAssignment,
  listConverters.convertListAccess,

  expressionConverters.convertCompoundAssignment, // Before simple assignment
  expressionConverters.convertFunctionCall, // Before object instantiation
  expressionConverters.convertStandaloneFunctionCall, // For procedure calls without return value
  
  // Object-oriented patterns - after function calls
  objectOrientedConverters.convertObjectInstantiation,
  objectOrientedConverters.convertMethodAssignment,
  objectOrientedConverters.convertMethodCall,
  objectOrientedConverters.convertSelfAssignment,
  
  expressionConverters.convertAssignment,
  
  // Standalone expressions - last resort for unmatched expressions
  expressionConverters.convertStandaloneExpression,
];

export * from './control-flow';
export * from './declarations';
export {
  // Explicitly export non-conflicting members from expressions
  convertPrint,
  convertReturn,
  convertConstant,
  convertLambda,
  convertListComprehension,
  convertMultipleAssignment,
  convertDictionaryLiteral,
  convertDictionaryAssignment,
  convertCompoundAssignment,
  convertAssignment,
} from './expressions';
export * from './error-handling';
export * from './object-oriented';
export * from './lists';
export * from './file-operations';
