import { controlFlowConverters } from './control-flow';
import { declarationConverters } from './declarations';
import { expressionConverters } from './expressions';
import { ConverterFunction } from '../types';

export const ALL_CONVERTERS: ConverterFunction[] = [
  // Order matters: More specific patterns should come before general ones.
  // Example: ELIF before IF if they shared a common prefix (they don't here, but as a principle)
  // Example: Compound assignment before simple assignment

  // Control Flow - specific keywords first
  controlFlowConverters.convertRepeat, // Must be before WHILE to catch '# repeat' with 'while True'
  controlFlowConverters.convertElif,
  controlFlowConverters.convertElse,
  controlFlowConverters.convertIf,
  controlFlowConverters.convertForRange,
  controlFlowConverters.convertForCollection,
  controlFlowConverters.convertWhile,
  controlFlowConverters.convertTry,
  controlFlowConverters.convertExcept,
  controlFlowConverters.convertFinally,

  // Declarations
  declarationConverters.convertFunctionDef,
  declarationConverters.convertClassDef,

  // Expressions & Statements - specific keywords/patterns first
  expressionConverters.convertReturn,
  expressionConverters.convertPrint, // Before assignment, as print() is specific
  // Input is handled within convertAssignment for now
  expressionConverters.convertCompoundAssignment, // Before simple assignment
  expressionConverters.convertAssignment, 
  expressionConverters.convertStandaloneExpression, // For function calls etc. not assigned
];