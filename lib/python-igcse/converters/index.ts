import { controlFlowConverters } from './control-flow';
import { declarationConverters } from './declarations';
import { expressionConverters } from './expressions';
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
  expressionConverters.convertCompoundAssignment, // Before simple assignment
  expressionConverters.convertAssignment,
];

export * from './control-flow';
export * from './declarations';
export * from './expressions';