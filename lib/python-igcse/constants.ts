export const INDENT_SIZE = 2; // For pseudocode output
export const PYTHON_INDENT_SIZE = 4; // Typical Python indent

export const OPERATORS = {
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
  POW: '^',
} as const;

export const COMPOUND_ASSIGNMENT_OPERATORS = [
  { python: '+=', pseudocode: '+' },
  { python: '-=', pseudocode: '-' },
  { python: '*=', pseudocode: '*' },
  { python: '/=', pseudocode: '/' },
  { python: '%=', pseudocode: 'MOD' },
  { python: '//=', pseudocode: 'DIV' },
  { python: '**=', pseudocode: '^' },
];

export const KEYWORDS = {
  FUNCTION: 'FUNCTION',
  PROCEDURE: 'PROCEDURE',
  CLASS: 'CLASS',
  IF: 'IF',
  THEN: 'THEN',
  ELSE_IF: 'ELSE IF',
  ELSE: 'ELSE',
  END_IF: 'ENDIF',
  FOR: 'FOR',
  FOR_EACH: 'FOR EACH',
  IN: 'IN',
  TO: 'TO',
  STEP: 'STEP',
  NEXT: 'NEXT',
  WHILE: 'WHILE',
  DO: 'DO',
  END_WHILE: 'ENDWHILE',
  REPEAT: 'REPEAT',
  UNTIL: 'UNTIL',
  RETURN: 'RETURN',
  OUTPUT: 'OUTPUT',
  INPUT: 'INPUT',
  DECLARE: 'DECLARE',
  CONSTANT: 'CONSTANT',
  END_FUNCTION: 'ENDFUNCTION',
  END_PROCEDURE: 'ENDPROCEDURE',
  END_CLASS: 'ENDCLASS',
  // Object-oriented keywords
  INHERITS: 'INHERITS',
  NEW: 'NEW',
  CALL: 'CALL',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
  SELF: 'self',
} as const;

export const BLOCK_TYPES = {
  FUNCTION: 'function',
  PROCEDURE: 'procedure',
  CLASS: 'class',
  IF: 'if',
  ELIF: 'elif',
  ELSE: 'else',
  FOR: 'for',
  WHILE: 'while',
  REPEAT: 'repeat', // Added for REPEAT UNTIL loops
  ENDIF: 'endif',
  NEXT: 'next',
  ENDWHILE: 'endwhile',
  ENDFUNCTION: 'endfunction',
  ENDCLASS: 'endclass',
  RETURN: 'return',
  TRY: 'try',
  EXCEPT: 'except',
  FINALLY: 'finally',
  // Object-oriented block types
  CONSTRUCTOR: 'constructor',
  METHOD: 'method',
  // Add other block types as needed
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];