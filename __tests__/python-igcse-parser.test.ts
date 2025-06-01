import { pythonToIGCSEPseudocode } from '../lib/python-to-pseudocode-parser-igcse-refactored';

describe('Python to IGCSE Pseudocode Parser', () => {
  // 1. Variables and Constants
  test('should handle variable declarations', () => {
    const pythonCode = `counter = 5
name = "John"`;
    const expectedPseudocode = `DECLARE counter : INTEGER
counter ← 5
DECLARE name : STRING
name ← "John"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle constants', () => {
    const pythonCode = `PI = 3.14`;
    const expectedPseudocode = `CONSTANT PI = 3.14`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 2. Basic Assignment
  test('should handle basic assignment', () => {
    const pythonCode = `x = 10
y = "hello"
z = True`;
    const expectedPseudocode = `DECLARE x : INTEGER
x ← 10
DECLARE y : STRING
y ← "hello"
DECLARE z : BOOLEAN
z ← TRUE`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 3. Arithmetic Operations
  test('should handle arithmetic operations', () => {
    const pythonCode = `result = a + b - c * d / e
remainder = x % y
quotient = x // y`;
    const expectedPseudocode = `DECLARE result : REAL
result ← a + b - c * d / e
DECLARE remainder : INTEGER
remainder ← x MOD y
DECLARE quotient : INTEGER
quotient ← x DIV y`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 4. String Operations
  test('should handle string concatenation', () => {
    const pythonCode = `greeting = "Hello" + " " + name`;
    const expectedPseudocode = `DECLARE greeting : STRING
greeting ← "Hello" & " " & name`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 5. Boolean Operations
  test('should handle boolean operations', () => {
    const pythonCode = `result = a and b or not c`;
    const expectedPseudocode = `DECLARE result : BOOLEAN
result ← a AND b OR NOT c`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 6. Comparison Operations
  test('should handle comparison operations', () => {
    const pythonCode = `result = x > y and a <= b and c != d and e == f`;
    const expectedPseudocode = `DECLARE result : BOOLEAN
result ← x > y AND a ≤ b AND c ≠ d AND e = f`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 7. IF-ELSE Structures
  test('should handle simple if statement', () => {
    const pythonCode = `if score >= 50:
    print("Pass")`;
    const expectedPseudocode = `IF score ≥ 50 THEN
   OUTPUT "Pass"
ENDIF`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle if-else statement', () => {
    const pythonCode = `if score >= 50:
    print("Pass")
else:
    print("Fail")`;
    const expectedPseudocode = `IF score ≥ 50 THEN
   OUTPUT "Pass"
ELSE
   OUTPUT "Fail"
ENDIF`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle if-elif-else statement', () => {
    const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;
    const expectedPseudocode = `IF score ≥ 90 THEN
   OUTPUT "A"
ELSE
   IF score ≥ 80 THEN
      OUTPUT "B"
   ELSE
      OUTPUT "C"
   ENDIF
ENDIF`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle nested if statements', () => {
    const pythonCode = `if x > y:
    if x > z:
        print("x is largest")
    else:
        print("z is largest")
else:
    print("y might be largest")`;
    const expectedPseudocode = `IF x > y THEN
   IF x > z THEN
      OUTPUT "x is largest"
   ELSE
      OUTPUT "z is largest"
   ENDIF
ELSE
   OUTPUT "y might be largest"
ENDIF`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 8. FOR Loops
  test('should handle for loop with range', () => {
    const pythonCode = `for i in range(1, 11):
    print(i)`;
    const expectedPseudocode = `FOR i ← 1 TO 10
   OUTPUT i
NEXT i`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle for loop with step', () => {
    const pythonCode = `for i in range(10, 0, -1):
    print(i)`;
    const expectedPseudocode = `FOR i ← 10 TO 1 STEP -1
   OUTPUT i
NEXT i`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle for loop with positive step', () => {
    const pythonCode = `for i in range(0, 10, 2):
    print(i)`;
    const expectedPseudocode = `FOR i ← 0 TO 8 STEP 2
   OUTPUT i
NEXT i`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle for loop over collection', () => {
    const pythonCode = `for item in my_list:
    print(item)`;
    const expectedPseudocode = `FOR EACH item IN my_list
   OUTPUT item
NEXT item`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 9. WHILE Loops
  test('should handle while loop', () => {
    const pythonCode = `while x < 10:
    x = x + 1`;
    const expectedPseudocode = `WHILE x < 10
   x ← x + 1
ENDWHILE`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle while loop with complex condition', () => {
    const pythonCode = `while x < 10 and y > 0:
    x = x + 1
    y = y - 1`;
    const expectedPseudocode = `WHILE x < 10 AND y > 0
   x ← x + 1
   y ← y - 1
ENDWHILE`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 10. Functions
  test('should handle function definition', () => {
    const pythonCode = `def greet(name):
    print("Hello", name)`;
    const expectedPseudocode = `PROCEDURE Greet(name : STRING)
   OUTPUT "Hello", name
ENDPROCEDURE`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle function with return', () => {
    const pythonCode = `def add(x, y):
    return x + y`;
    const expectedPseudocode = `FUNCTION Add(x : INTEGER, y : INTEGER) RETURNS INTEGER
   RETURN x + y
ENDFUNCTION`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle function with multiple parameters and types', () => {
    const pythonCode = `def calculate(num1, num2, operation):
    if operation == "add":
        return num1 + num2
    else:
        return num1 - num2`;
    const expectedPseudocode = `FUNCTION Calculate(num1 : REAL, num2 : REAL, operation : STRING) RETURNS REAL
   IF operation = "add" THEN
      RETURN num1 + num2
   ELSE
      RETURN num1 - num2
   ENDIF
ENDFUNCTION`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle function call', () => {
    const pythonCode = `result = add(5, 3)
greet("John")`;
    const expectedPseudocode = `DECLARE result : INTEGER
result ← Add(5, 3)
CALL Greet("John")`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 11. Arrays/Lists
  test('should handle list declaration and access', () => {
    const pythonCode = `numbers = [1, 2, 3, 4, 5]
first = numbers[0]
numbers[1] = 10`;
    const expectedPseudocode = `DECLARE numbers : ARRAY[0:4] OF INTEGER
numbers[0] ← 1
numbers[1] ← 2
numbers[2] ← 3
numbers[3] ← 4
numbers[4] ← 5
DECLARE first : INTEGER
first ← numbers[0]
numbers[1] ← 10`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle empty list', () => {
    const pythonCode = `empty_list = []`;
    const expectedPseudocode = `DECLARE empty_list : ARRAY[0:0] OF INTEGER`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle list with mixed types', () => {
    const pythonCode = `mixed = [1, "hello", True]`;
    const expectedPseudocode = `DECLARE mixed : ARRAY[0:2] OF STRING
mixed[0] ← "1"
mixed[1] ← "hello"
mixed[2] ← "TRUE"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 12. Input/Output
  test('should handle input statements', () => {
    const pythonCode = `name = input("Enter your name: ")
age = int(input("Enter your age: "))`;
    const expectedPseudocode = `OUTPUT "Enter your name: "
INPUT name
OUTPUT "Enter your age: "
INPUT age`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle print statements', () => {
    const pythonCode = `print("Hello World")
print("Your age is", age)
print(f"Hello {name}")`;
    const expectedPseudocode = `OUTPUT "Hello World"
OUTPUT "Your age is", age
OUTPUT "Hello " & name`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 13. Comments
  test('should handle comments', () => {
    const pythonCode = `# This is a comment
x = 5  # Another comment
# Multi-line comment
# continues here
y = 10`;
    const expectedPseudocode = `// This is a comment
DECLARE x : INTEGER
x ← 5  // Another comment
// Multi-line comment
// continues here
DECLARE y : INTEGER
y ← 10`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 14. Try-Except (Error Handling)
  test('should handle try-except block', () => {
    const pythonCode = `try:
    result = 10 / x
except:
    print("Error occurred")`;
    const expectedPseudocode = `// Error handling: try-except block
IF x ≠ 0 THEN
   DECLARE result : REAL
   result ← 10 / x
ELSE
   OUTPUT "Error occurred"
ENDIF`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle try-except-finally block', () => {
    const pythonCode = `try:
    file = open("data.txt")
    data = file.read()
except:
    print("File not found")
finally:
    print("Cleanup")`;
    const expectedPseudocode = `// Error handling: try-except-finally block
OPENFILE "data.txt" FOR READ
IF file_exists THEN
   READFILE "data.txt", data
ELSE
   OUTPUT "File not found"
ENDIF
OUTPUT "Cleanup"
CLOSEFILE "data.txt"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 15. Classes (Object-Oriented Programming)
  test('should handle class definition', () => {
    const pythonCode = `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        print("Animal sound")`;
    const expectedPseudocode = `CLASS Animal
   PRIVATE name : STRING
   
   PUBLIC PROCEDURE NEW(name : STRING)
      self.name ← name
   ENDPROCEDURE
   
   PUBLIC PROCEDURE Speak()
      OUTPUT "Animal sound"
   ENDPROCEDURE
ENDCLASS`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle class inheritance', () => {
    const pythonCode = `class Dog(Animal):
    def speak(self):
        print("Woof")`;
    const expectedPseudocode = `CLASS Dog INHERITS Animal
   PUBLIC PROCEDURE Speak()
      OUTPUT "Woof"
   ENDPROCEDURE
ENDCLASS`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle object instantiation and method calls', () => {
    const pythonCode = `my_dog = Dog("Buddy")
my_dog.speak()`;
    const expectedPseudocode = `DECLARE my_dog : Dog
my_dog ← NEW Dog("Buddy")
CALL my_dog.Speak()`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 16. File Handling
  test('should handle file operations', () => {
    const pythonCode = `with open("input.txt", "r") as file:
    for line in file:
        print(line.strip())`;
    const expectedPseudocode = `OPENFILE "input.txt" FOR READ
WHILE NOT EOF("input.txt")
   READFILE "input.txt", line
   OUTPUT line
ENDWHILE
CLOSEFILE "input.txt"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  test('should handle file writing', () => {
    const pythonCode = `with open("output.txt", "w") as file:
    file.write("Hello World")
    file.write(str(number))`;
    const expectedPseudocode = `OPENFILE "output.txt" FOR WRITE
WRITEFILE "output.txt", "Hello World"
WRITEFILE "output.txt", number
CLOSEFILE "output.txt"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 17. Advanced Control Structures
  test('should handle break and continue in loops', () => {
    const pythonCode = `for i in range(10):
    if i == 5:
        break
    if i % 2 == 0:
        continue
    print(i)`;
    const expectedPseudocode = `FOR i ← 0 TO 9
   IF i = 5 THEN
      // break - exit loop
      EXIT FOR
   ENDIF
   IF i MOD 2 = 0 THEN
      // continue - skip to next iteration
      NEXT i
   ENDIF
   OUTPUT i
NEXT i`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 18. Dictionary/Record-like structures
  test('should handle dictionary operations', () => {
    const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;
    const expectedPseudocode = `TYPE StudentRecord
   DECLARE name : STRING
   DECLARE age : INTEGER
   DECLARE grade : STRING
ENDTYPE

DECLARE student : StudentRecord
student.name ← "John"
student.age ← 20
OUTPUT student.name
student.grade ← "A"`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 19. Complex Expressions
  test('should handle complex mathematical expressions', () => {
    const pythonCode = `result = (a + b) * (c - d) / (e + f)
power = x ** 2
square_root = x ** 0.5`;
    const expectedPseudocode = `DECLARE result : REAL
result ← (a + b) * (c - d) / (e + f)
DECLARE power : REAL
power ← x ^ 2
DECLARE square_root : REAL
square_root ← x ^ 0.5`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 20. Multiple Variable Assignment
  test('should handle multiple variable assignment', () => {
    const pythonCode = `a, b = 1, 2
x, y, z = 10, 20, 30`;
    const expectedPseudocode = `DECLARE a : INTEGER
DECLARE b : INTEGER
a ← 1
b ← 2
DECLARE x : INTEGER
DECLARE y : INTEGER
DECLARE z : INTEGER
x ← 10
y ← 20
z ← 30`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 21. Lambda Functions (as simple functions)
  test('should handle lambda functions', () => {
    const pythonCode = `square = lambda x: x * x
result = square(5)`;
    const expectedPseudocode = `FUNCTION Square(x : INTEGER) RETURNS INTEGER
   RETURN x * x
ENDFUNCTION

DECLARE result : INTEGER
result ← Square(5)`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 22. List Comprehensions (as loops)
  test('should handle list comprehensions', () => {
    const pythonCode = `squares = [x*x for x in range(5)]`;
    const expectedPseudocode = `DECLARE squares : ARRAY[0:4] OF INTEGER
DECLARE index : INTEGER
index ← 0
FOR x ← 0 TO 4
   squares[index] ← x * x
   index ← index + 1
NEXT x`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 23. String Methods
  test('should handle string methods', () => {
    const pythonCode = `text = "Hello World"
upper_text = text.upper()
length = len(text)
first_char = text[0]`;
    const expectedPseudocode = `DECLARE text : STRING
text ← "Hello World"
DECLARE upper_text : STRING
upper_text ← UPPER(text)
DECLARE length : INTEGER
length ← LENGTH(text)
DECLARE first_char : STRING
first_char ← MID(text, 0, 1)`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 24. Boolean Values
  test('should handle boolean values and operations', () => {
    const pythonCode = `is_valid = True
is_empty = False
result = is_valid and not is_empty`;
    const expectedPseudocode = `DECLARE is_valid : BOOLEAN
is_valid ← TRUE
DECLARE is_empty : BOOLEAN
is_empty ← FALSE
DECLARE result : BOOLEAN
result ← is_valid AND NOT is_empty`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });

  // 25. Nested Loops
  test('should handle nested loops', () => {
    const pythonCode = `for i in range(3):
    for j in range(3):
        print(i, j)`;
    const expectedPseudocode = `FOR i ← 0 TO 2
   FOR j ← 0 TO 2
      OUTPUT i, j
   NEXT j
NEXT i`;
    const result = pythonToIGCSEPseudocode(pythonCode);
    console.log('Actual Pseudocode for nested if statements:');
    console.log(result);
    expect(result).toBe(expectedPseudocode);
  });
});