import { pythonToIB } from 'python2ib';

describe('Python to IB Pseudocode Parser', () => {

  test('should convert simple assignment', () => {
    const pythonCode = 'x = 10';
    const expectedPseudocode = 'x ← 10';
    const result = pythonToIB(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert print statement', () => {
    const pythonCode = 'print("Hello, World!")';
    const expectedPseudocode = 'OUTPUT "Hello, World!"';
    const result = pythonToIB(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert input statement', () => {
    const pythonCode = 'name = input("Enter your name: ")';
    const expectedPseudocode = 'INPUT name';
    const result = pythonToIB(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert if statement', () => {
    const pythonCode = [
      'if x > 5:',
      '  print("Greater")'
    ].join('\n');
    const expectedPseudocode = [
      'IF x > 5 THEN',
      '  OUTPUT "Greater"',
      'END IF'
    ].join('\n');
    const result = pythonToIB(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert if-else statement', () => {
    const input = `if x > 5:
  print("Greater")
else:
  print("Smaller or Equal")`;
    const output = parser.parse(input);
    const expected = `IF x > 5 THEN
  OUTPUT "Greater"
ELSE
  OUTPUT "Smaller OR Equal"
END IF`;
    expect(output).toBe(expected);
  });

  test('should convert if-elif-else statement', () => {
    const pythonCode = [
      'if x > 10:',
      '  print("Greater than 10")',
      'elif x > 5:',
      '  print("Greater than 5")',
      'else:',
      '  print("Smaller or Equal to 5")'
    ].join('\n');
    const expectedPseudocode = [
      'IF x > 10 THEN',
      '  OUTPUT "Greater than 10"',
      'ELSE IF x > 5 THEN',
      '  OUTPUT "Greater than 5"',
      'ELSE',
      '  OUTPUT "Smaller OR Equal to 5"',
      'END IF'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert for loop with range', () => {
    const pythonCode = [
      'for i in range(5):',
      '  print(i)'
    ].join('\n');
    const expectedPseudocode = [
      'loop i from 0 to 4',
      '  OUTPUT i',
      'end loop'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert for loop with range and step', () => {
    const pythonCode = [
      'for i in range(0, 10, 2):',
      '  print(i)'
    ].join('\n');
    const expectedPseudocode = [
      'loop i from 0 to 9',
      '  OUTPUT i',
      'end loop'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert for loop over a collection', () => {
    const pythonCode = [
      'my_list = [1, 2, 3]',
      'for item in my_list:',
      '  print(item)'
    ].join('\n');
    const expectedPseudocode = [
      'my_list ← [1, 2, 3]',
      'my_list.resetNext()',
      'loop WHILE my_list.hasNext()',
      '    item ← my_list.getNext()',
      '  OUTPUT item',
      'end loop'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });


  test('should convert while loop', () => {
    const pythonCode = [
      'count = 0',
      'while count < 5:',
      '  print(count)',
      '  count += 1'
    ].join('\n');
    const expectedPseudocode = [
      'count ← 0',
      'WHILE count < 5 DO',
      '  OUTPUT count',
      '  count ← count + 1',
      'END WHILE'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert function definition', () => {
    const pythonCode = [
      'def greet(name):',
      '  print(f"Hello, {name}")'
    ].join('\n');
    const expectedPseudocode = [
      'FUNCTION greet(name)',
      '  OUTPUT "Hello, " + name',
      'END FUNCTION'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert function definition with return', () => {
    const pythonCode = [
      'def add(a, b):',
      '  return a + b'
    ].join('\n');
    const expectedPseudocode = [
      'FUNCTION add(a, b)',
      '  RETURN a + b',
      'END FUNCTION'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert class definition', () => {
    const pythonCode = [
      'class MyClass:',
      '  def __init__(self, value):',
      '    self.value = value',
      '  def get_value(self):',
      '    return self.value'
    ].join('\n');
    const expectedPseudocode = [
      'CLASS MyClass',
      '  FUNCTION __init__(self, value)',
      '    self.value ← value',
      '    END FUNCTION',
      '  FUNCTION get_value(self)',
      '    RETURN self.value',
      '    END FUNCTION'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle comments', () => {
    const pythonCode = [
      '# This is a comment',
      'x = 10  # Another comment'
    ].join('\n');
    const expectedPseudocode = [
      '// This is a comment',
      'x ← 10 # Another comment'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle try-except block', () => {
    const pythonCode = [
      'try:',
      '  x = 1 / 0',
      'except ZeroDivisionError:',
      '  print("Cannot divide by zero")'
    ].join('\n');
    const expectedPseudocode = [
      'TRY',
      '  x ← 1 / 0',
      'CATCH ZeroDivisionError',
      '  OUTPUT "Cannot divide by zero"',
      'END TRY'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle try-except-finally block', () => {
    const pythonCode = [
      'try:',
      '  x = 1 / 0',
      'except ZeroDivisionError:',
      '  print("Cannot divide by zero")',
      'finally:',
      '  print("Execution finished")'
    ].join('\n');
    const expectedPseudocode = [
      'TRY',
      '  x ← 1 / 0',
      'CATCH ZeroDivisionError',
      '  OUTPUT "Cannot divide by zero"',
      'FINALLY',
      '  OUTPUT "Execution finished"',
      'END TRY'
    ].join('\n');
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

   test('should convert compound assignment (+=)', () => {
    const pythonCode = 'x += 5';
    const expectedPseudocode = 'x ← x + 5';
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert compound assignment (-=)', () => {
    const pythonCode = 'y -= 3';
    const expectedPseudocode = 'y ← y - 3';
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

  test('should convert logical operators (and, or, not)', () => {
    const pythonCode = 'if x > 0 and y < 10:';
    const expectedPseudocode = 'IF x > 0 AND y < 10 THEN'; // Keep THEN for IF context
    // If parsing only the condition: 'x > 0 AND y < 10'
    expect(parser.parse(pythonCode).split('\n')[0]).toBe(expectedPseudocode);
  });

  test('should convert f-string print to concatenation in IB style', () => {
    const pythonCode = 'name = "World"\nprint(f"Hello, {name}!")';
    // Based on IB Pseudocode rules, f-strings are typically converted to concatenation.
    // However, the previous test 'should convert function definition' kept f-string.
    // For consistency and common pseudocode practice, we'll use concatenation here.
    // This might require adjusting the `FUNCTION greet(name)` test or clarifying IB f-string rules.
    const expectedPseudocode = 'name ← "World"\nOUTPUT "Hello, " + name + "!"';
    const result = parser.parse(pythonCode);
    
    
    
    expect(result).toBe(expectedPseudocode);
  });

});