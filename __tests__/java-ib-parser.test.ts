import { statementConverters } from '../lib/java-ib/converters/statements';
import { classConverter } from '../lib/java-ib/converters/class';
import { controlFlowConverters } from '../lib/java-ib/converters/control-flow';
import { Java2IB } from '../lib/java-to-pseudocode-parser-ib';

const {
  printStmt,
  returnStmt,
  inputStmt,
  assignStmt,
  varDecl,
  constDecl,
  arrayDecl,
  mathExpr,
  compAssign,
} = statementConverters;

const {
  ifBlock,
  elifBlock,
  elseBlock,
  forCount,
  forEach,
  whileBlock,
  doBlock, // Changed from doWhileBlock
  tryBlock,
  catchBlock,
  finallyBlock,
} = controlFlowConverters; // Changed from controlConverters

describe('Java2IB Statement Converters', () => {
  test('println becomes OUTPUT', () => {
    const result = printStmt('System.out.println("Hello");', '    ');
    expect(result.code).toBe('    OUTPUT "Hello"');
    expect(result.changed).toBe(true);
  });

  test('print becomes OUTPUT', () => {
    const result = printStmt('System.out.print(variable);', '  ');
    expect(result.code).toBe('  OUTPUT variable');
    expect(result.changed).toBe(true);
  });

  test('return statement conversion', () => {
    const result = returnStmt('return value;', '');
    expect(result.code).toBe('RETURN value');
    expect(result.changed).toBe(true);
  });

  test('empty return statement', () => {
    const result = returnStmt('return;', '  ');
    expect(result.code).toBe('  RETURN');
    expect(result.changed).toBe(true);
  });

  test('input statement conversion', () => {
    const result = inputStmt('x = scanner.nextInt();', '    ');
    expect(result.code).toBe('    INPUT x');
    expect(result.changed).toBe(true);
  });

  test('assignment statement conversion', () => {
    const result = assignStmt('x = 5;', '');
    expect(result.code).toBe('x ← 5');
    expect(result.changed).toBe(true);
  });

  test('variable declaration', () => {
    const result = varDecl('int count = 10;', '');
    expect(result.code).toBe('DECLARE count ← 10');
    expect(result.changed).toBe(true);
  });

  test('constant declaration', () => {
    const result = constDecl('final int MAX = 100;', '  ');
    expect(result.code).toBe('  CONSTANT MAX ← 100');
    expect(result.changed).toBe(true);
  });

  test('array literal declaration', () => {
    const result = arrayDecl('int[] arr = {1, 2, 3};', '');
    expect(result.code).toBe('DECLARE arr ← [1, 2, 3]');
    expect(result.changed).toBe(true);
  });

  test('array sized declaration', () => {
    const result = arrayDecl('String[] names = new String[5];', '    ');
    expect(result.code).toBe('    DECLARE names : ARRAY[5] OF STRING');
    expect(result.changed).toBe(true);
  });

  test('math function replacement', () => {
    const result = mathExpr('a = Math.pow(x, 2);', '');
    expect(result.code).toBe('a ← x ^ 2');
    expect(result.changed).toBe(true);
  });

  test('compound assignment', () => {
    const result = compAssign('x += 3;', '');
    expect(result.code).toBe('x ← x + 3');
    expect(result.changed).toBe(true);
  });

  test('non-matching statement', () => {
    const result = printStmt('not a print stmt', '');
    expect(result.changed).toBe(false);
  });
});

describe('Java2IB Control Converters', () => {
  test('if statement', () => {
    const result = ifBlock('if (x == 5) {', '');
    expect(result.code).toBe('IF x = 5 THEN');
    expect(result.block).toBe('if');
  });

  test('else-if statement', () => {
    const result = elifBlock('else if (y != 0) {', '  ');
    expect(result.code).toBe('  ELSE IF y ≠ 0 THEN');
    expect(result.block).toBe('elif');
  });

  test('else statement', () => {
    const result = elseBlock('else {', '');
    expect(result.code).toBe('ELSE');
    expect(result.block).toBe('else');
  });

  test('for count loop', () => {
    const result = forCount('for (int i = 0; i < 3; i++) {', '    ');
    expect(result.code).toBe('    FOR i FROM 0 TO 2 DO');
    expect(result.block).toBe('for');
  });

  test('for-each loop', () => {
    const result = forEach('for (item : list) {', '');
    expect(result.code).toBe('FOR EACH item IN list DO');
    expect(result.block).toBe('for');
  });

  test('while loop', () => {
    const result = whileBlock('while (flag) {', '');
    expect(result.code).toBe('WHILE flag DO');
    expect(result.block).toBe('while');
  });

  test('do-while loop', () => {
    const result = doBlock('do {', ''); 
    expect(result.code).toBe('REPEAT');
    expect(result.block).toBe('repeat');
  });
});

describe('Java2IB Integration Tests', () => {
  const parser = new Java2IB();
  
  test('nested if-else and loops', () => {
    const input = `if (x > 0) {
      for (int i = 1; i <= x; i++) {
          System.out.print(i);
      }
  } else if (x < 0) {
      System.out.println("Neg");
  } else {
      System.out.println("Zero");
  }`;
    
    const expected = `IF x > 0 THEN
      FOR i FROM 1 TO x DO
          OUTPUT i
      END FOR
  ELSE IF x < 0 THEN
      OUTPUT "Neg"
  ELSE
      OUTPUT "Zero"
  END IF`;
    
    expect(parser.parse(input)).toBe(expected);
  });
});
