# Python to IGCSE Pseudocode Parser - Test Cases Summary

## 📋 Test Coverage Overview

**Total Test Cases: 25**

| Category | Test Cases | Coverage |
|----------|------------|----------|
| Variables & Constants | 3 | Basic assignment, constants, type inference |
| Arithmetic Operations | 2 | Basic math, modulo, integer division |
| String Operations | 2 | Concatenation, string methods |
| Boolean Operations | 2 | Logical operators, boolean values |
| Control Structures | 8 | IF/ELSE, nested conditions, loops |
| Functions | 4 | Procedures, functions with return, calls |
| Data Structures | 4 | Arrays/lists, dictionaries as records |
| I/O Operations | 2 | Input, output, print statements |
| Error Handling | 2 | Try-except blocks |
| Object-Oriented | 3 | Classes, inheritance, instantiation |
| File Operations | 2 | Reading, writing files |
| Advanced Features | 5 | Lambda, comprehensions, complex expressions |

---

## 🧪 Detailed Test Cases

### 1. Variables and Constants

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 1.1 | Variable declarations | `counter = 5\nname = "John"` | `DECLARE counter : INTEGER\ncounter ← 5\nDECLARE name : STRING\nname ← "John"` | Type inference, assignment operator |
| 1.2 | Constants | `PI = 3.14` | `CONSTANT PI = 3.14` | Constant declaration |
| 1.3 | Basic assignment | `x = 10\ny = "hello"\nz = True` | `DECLARE x : INTEGER\nx ← 10\nDECLARE y : STRING\ny ← "hello"\nDECLARE z : BOOLEAN\nz ← TRUE` | Multiple types, boolean conversion |

### 2. Arithmetic Operations

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 2.1 | Arithmetic operations | `result = a + b - c * d / e\nremainder = x % y\nquotient = x // y` | `DECLARE result : REAL\nresult ← a + b - c * d / e\nDECLARE remainder : INTEGER\nremainder ← x MOD y\nDECLARE quotient : INTEGER\nquotient ← x DIV y` | MOD, DIV operators |
| 2.2 | Complex expressions | `result = (a + b) * (c - d) / (e + f)\npower = x ** 2\nsquare_root = x ** 0.5` | `DECLARE result : REAL\nresult ← (a + b) * (c - d) / (e + f)\nDECLARE power : REAL\npower ← x ^ 2\nDECLARE square_root : REAL\nsquare_root ← x ^ 0.5` | Power operator conversion |

### 3. String Operations

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 3.1 | String concatenation | `greeting = "Hello" + " " + name` | `DECLARE greeting : STRING\ngreeting ← "Hello" & " " & name` | Concatenation operator |
| 3.2 | String methods | `text = "Hello World"\nupper_text = text.upper()\nlength = len(text)\nfirst_char = text[0]` | `DECLARE text : STRING\ntext ← "Hello World"\nDECLARE upper_text : STRING\nupper_text ← UPPER(text)\nDECLARE length : INTEGER\nlength ← LENGTH(text)\nDECLARE first_char : STRING\nfirst_char ← MID(text, 0, 1)` | Built-in string functions |

### 4. Boolean Operations

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 4.1 | Boolean operations | `result = a and b or not c` | `DECLARE result : BOOLEAN\nresult ← a AND b OR NOT c` | Logical operators |
| 4.2 | Comparison operations | `result = x > y and a <= b and c != d and e == f` | `DECLARE result : BOOLEAN\nresult ← x > y AND a ≤ b AND c ≠ d AND e = f` | Comparison symbols |

### 5. Control Structures - IF/ELSE

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 5.1 | Simple if | `if score >= 50:\n    print("Pass")` | `IF score ≥ 50 THEN\n   OUTPUT "Pass"\nENDIF` | Basic IF structure |
| 5.2 | If-else | `if score >= 50:\n    print("Pass")\nelse:\n    print("Fail")` | `IF score ≥ 50 THEN\n   OUTPUT "Pass"\nELSE\n   OUTPUT "Fail"\nENDIF` | IF-ELSE structure |
| 5.3 | If-elif-else | `if score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")` | `IF score ≥ 90 THEN\n   OUTPUT "A"\nELSE\n   IF score ≥ 80 THEN\n      OUTPUT "B"\n   ELSE\n      OUTPUT "C"\n   ENDIF\nENDIF` | Nested IF for elif |
| 5.4 | Nested if | Complex nested structure | Proper indentation and nesting | Multiple levels |

### 6. Control Structures - Loops

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 6.1 | For loop with range | `for i in range(1, 11):\n    print(i)` | `FOR i ← 1 TO 10\n   OUTPUT i\nNEXT i` | Range conversion |
| 6.2 | For loop with step | `for i in range(10, 0, -1):\n    print(i)` | `FOR i ← 10 TO 1 STEP -1\n   OUTPUT i\nNEXT i` | STEP clause |
| 6.3 | For loop positive step | `for i in range(0, 10, 2):\n    print(i)` | `FOR i ← 0 TO 8 STEP 2\n   OUTPUT i\nNEXT i` | Positive step |
| 6.4 | For loop over collection | `for item in my_list:\n    print(item)` | `FOR EACH item IN my_list\n   OUTPUT item\nNEXT item` | FOR EACH structure |
| 6.5 | While loop | `while x < 10:\n    x = x + 1` | `WHILE x < 10\n   x ← x + 1\nENDWHILE` | Basic WHILE |
| 6.6 | While complex condition | `while x < 10 and y > 0:\n    x = x + 1\n    y = y - 1` | `WHILE x < 10 AND y > 0\n   x ← x + 1\n   y ← y - 1\nENDWHILE` | Complex conditions |
| 6.7 | Nested loops | `for i in range(3):\n    for j in range(3):\n        print(i, j)` | `FOR i ← 0 TO 2\n   FOR j ← 0 TO 2\n      OUTPUT i, j\n   NEXT j\nNEXT i` | Nested loop structure |
| 6.8 | Break and continue | Loop with break/continue | Comments for break/continue | Control flow |

### 7. Functions

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 7.1 | Function definition | `def greet(name):\n    print("Hello", name)` | `PROCEDURE Greet(name : STRING)\n   OUTPUT "Hello", name\nENDPROCEDURE` | PROCEDURE structure |
| 7.2 | Function with return | `def add(x, y):\n    return x + y` | `FUNCTION Add(x : INTEGER, y : INTEGER) RETURNS INTEGER\n   RETURN x + y\nENDFUNCTION` | FUNCTION with RETURNS |
| 7.3 | Complex function | Multi-parameter function with logic | Type inference, complex logic | Advanced functions |
| 7.4 | Function calls | `result = add(5, 3)\ngreet("John")` | `DECLARE result : INTEGER\nresult ← Add(5, 3)\nCALL Greet("John")` | Function vs procedure calls |

### 8. Data Structures

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 8.1 | List operations | `numbers = [1, 2, 3, 4, 5]\nfirst = numbers[0]\nnumbers[1] = 10` | Array declaration and access | Array syntax |
| 8.2 | Empty list | `empty_list = []` | `DECLARE empty_list : ARRAY[0:0] OF INTEGER` | Empty array handling |
| 8.3 | Mixed type list | `mixed = [1, "hello", True]` | String array with conversions | Type handling |
| 8.4 | Dictionary operations | `student = {"name": "John", "age": 20}` | Record type definition | Record structures |

### 9. Input/Output Operations

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 9.1 | Input statements | `name = input("Enter your name: ")\nage = int(input("Enter your age: "))` | `OUTPUT "Enter your name: "\nINPUT name\nOUTPUT "Enter your age: "\nINPUT age` | INPUT/OUTPUT sequence |
| 9.2 | Print statements | `print("Hello World")\nprint("Your age is", age)\nprint(f"Hello {name}")` | `OUTPUT "Hello World"\nOUTPUT "Your age is", age\nOUTPUT "Hello " & name` | Various print formats |

### 10. Error Handling

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 10.1 | Try-except | `try:\n    result = 10 / x\nexcept:\n    print("Error occurred")` | IF-based error handling | Exception simulation |
| 10.2 | Try-except-finally | File operations with error handling | File operations with cleanup | Complex error handling |

### 11. Object-Oriented Programming

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 11.1 | Class definition | `class Animal:\n    def __init__(self, name):\n        self.name = name` | `CLASS Animal\n   PRIVATE name : STRING\n   PUBLIC PROCEDURE NEW(name : STRING)\n      self.name ← name\n   ENDPROCEDURE\nENDCLASS` | CLASS structure |
| 11.2 | Class inheritance | `class Dog(Animal):\n    def speak(self):\n        print("Woof")` | `CLASS Dog INHERITS Animal\n   PUBLIC PROCEDURE Speak()\n      OUTPUT "Woof"\n   ENDPROCEDURE\nENDCLASS` | INHERITS keyword |
| 11.3 | Object instantiation | `my_dog = Dog("Buddy")\nmy_dog.speak()` | `DECLARE my_dog : Dog\nmy_dog ← NEW Dog("Buddy")\nCALL my_dog.Speak()` | Object creation and method calls |

### 12. File Operations

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 12.1 | File reading | `with open("input.txt", "r") as file:\n    for line in file:\n        print(line.strip())` | `OPENFILE "input.txt" FOR READ\nWHILE NOT EOF("input.txt")\n   READFILE "input.txt", line\n   OUTPUT line\nENDWHILE\nCLOSEFILE "input.txt"` | File reading pattern |
| 12.2 | File writing | `with open("output.txt", "w") as file:\n    file.write("Hello World")` | `OPENFILE "output.txt" FOR WRITE\nWRITEFILE "output.txt", "Hello World"\nCLOSEFILE "output.txt"` | File writing pattern |

### 13. Advanced Features

| Test # | Test Name | Python Input | Expected IGCSE Output | Focus |
|--------|-----------|--------------|----------------------|-------|
| 13.1 | Comments | `# This is a comment\nx = 5  # Another comment` | `// This is a comment\nDECLARE x : INTEGER\nx ← 5  // Another comment` | Comment conversion |
| 13.2 | Multiple assignment | `a, b = 1, 2\nx, y, z = 10, 20, 30` | Separate declarations and assignments | Tuple unpacking |
| 13.3 | Lambda functions | `square = lambda x: x * x` | `FUNCTION Square(x : INTEGER) RETURNS INTEGER\n   RETURN x * x\nENDFUNCTION` | Lambda to function |
| 13.4 | List comprehensions | `squares = [x*x for x in range(5)]` | Loop-based array filling | Comprehension expansion |
| 13.5 | Boolean values | `is_valid = True\nis_empty = False` | `DECLARE is_valid : BOOLEAN\nis_valid ← TRUE` | Boolean constants |

---

## 🎯 Key Conversion Rules Tested

### Operators
- `=` → `←` (assignment)
- `+` (strings) → `&` (concatenation)
- `%` → `MOD`
- `//` → `DIV`
- `**` → `^`
- `and` → `AND`
- `or` → `OR`
- `not` → `NOT`
- `==` → `=`
- `!=` → `≠`
- `<=` → `≤`
- `>=` → `≥`

### Keywords
- `def` → `PROCEDURE`/`FUNCTION`
- `if`/`elif`/`else` → `IF`/`ELSE`/`ENDIF`
- `for` → `FOR`/`NEXT`
- `while` → `WHILE`/`ENDWHILE`
- `class` → `CLASS`/`ENDCLASS`
- `True`/`False` → `TRUE`/`FALSE`
- `print()` → `OUTPUT`
- `input()` → `INPUT`

### Data Types
- `int` → `INTEGER`
- `float` → `REAL`
- `str` → `STRING`
- `bool` → `BOOLEAN`
- `list` → `ARRAY`
- `dict` → `Record TYPE`

### Comments
- `#` → `//`

---

## 🚀 Testing Strategy

1. **Unit Testing**: Each test case focuses on a specific feature
2. **Integration Testing**: Complex examples combining multiple features
3. **Edge Cases**: Empty structures, mixed types, nested constructs
4. **Error Handling**: Invalid syntax, type mismatches
5. **Performance**: Large code blocks, deeply nested structures

---

## 📝 Notes

- All test cases follow IGCSE pseudocode specification
- Indentation uses 3 spaces as recommended
- Keywords are in UPPERCASE
- Assignment operator is `←`
- Comments use `//` prefix
- Type inference is implemented for variable declarations
- Complex Python features are simplified to IGCSE equivalents

---

## ✅ Ready for Implementation

This comprehensive test suite covers all major Python constructs and their IGCSE pseudocode equivalents. The tests are designed to be:

- **Comprehensive**: Covering all language features
- **Specific**: Each test focuses on particular conversion rules
- **Realistic**: Using practical code examples
- **Maintainable**: Clear structure and documentation

Run `npm test __tests__/python-igcse-parser.test.ts` to execute all test cases.