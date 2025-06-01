import { controlFlowConverters } from './control-flow';
import { declarationConverters } from './declarations';
import { expressionConverters } from './expressions';
import * as errorHandlingConverters from './error-handling';
import * as listConverters from './lists';
import { ConverterFunction } from '../types';

export const ALL_CONVERTERS: ConverterFunction[] = [
  // Order matters: More specific patterns should come before general ones.
  
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
  expressionConverters.convertAssignment,
];

export * from './control-flow';
export * from './declarations';
export * from './expressions';
export * from './lists';