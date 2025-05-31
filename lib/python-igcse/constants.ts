export const INDENT_SIZE = 3;

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
  REPEAT: 'repeat',
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];