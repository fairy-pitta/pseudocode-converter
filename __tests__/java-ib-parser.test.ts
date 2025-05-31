import { statementConverters } from '../lib/java-ib/converters/statements';
import { classConverter } from '../lib/java-ib/converters/class';
import { controlFlowConverters } from '../lib/java-ib/converters/control-flow';
import { declarationConverters } from '../lib/java-ib/converters/declarations';
import { expressionConverters } from '../lib/java-ib/converters/expressions';
import { methodConverter } from '../lib/java-ib/converters/method';
import { Java2IB } from '../lib/java-to-pseudocode-parser-ib';
import { IBParser } from '../lib/python-to-pseudocode-parser-ib';

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
  doBlock,
  tryBlock,
  catchBlock,
  finallyBlock,
} = controlFlowConverters;

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

// Additional Java converter tests for comprehensive coverage
describe('Java2IB Method and Class Converters', () => {
  test('method converter - function', () => {
    const result = methodConverter('public int calculateSum(int a, int b) {', '');
    expect(result.code).toBe('FUNCTION calculateSum(int a, int b)');
    expect(result.block).toBe('function');
  });

  test('method converter - procedure', () => {
    const result = methodConverter('public void printMessage(String msg) {', '  ');
    expect(result.code).toBe('  PROCEDURE printMessage(String msg)');
    expect(result.block).toBe('procedure');
  });

  test('class converter', () => {
    const result = classConverter('public class Calculator {', '');
    expect(result.code).toBe('CLASS Calculator');
    expect(result.block).toBe('class');
  });
});

describe('Java2IB Expression Converters', () => {
  test('math expressions - power', () => {
    const result = expressionConverters.mathExpr('result = Math.pow(base, 2);', '');
    expect(result.code).toBe('result ← base ^ 2');
    expect(result.changed).toBe(true);
  });

  test('math expressions - square root', () => {
    const result = expressionConverters.mathExpr('value = Math.sqrt(number);', '  ');
    expect(result.code).toBe('  value ← √(number)');
    expect(result.changed).toBe(true);
  });

  test('compound assignment operators', () => {
    const result = expressionConverters.compAssign('counter += 5;', '');
    expect(result.code).toBe('counter ← counter + 5');
    expect(result.changed).toBe(true);
  });
});

describe('Java2IB Declaration Converters', () => {
  test('constant declaration', () => {
    const result = declarationConverters.constDecl('final int MAX_SIZE = 100;', '');
    expect(result.code).toBe('CONSTANT MAX_SIZE ← 100');
    expect(result.changed).toBe(true);
  });

  test('variable declaration with initialization', () => {
    const result = declarationConverters.varDecl('int count = 0;', '  ');
    expect(result.code).toBe('  DECLARE count ← 0');
    expect(result.changed).toBe(true);
  });

  test('array literal declaration', () => {
    const result = declarationConverters.arrayDecl('int[] numbers = {1, 2, 3, 4, 5};', '');
    expect(result.code).toBe('DECLARE numbers ← [1, 2, 3, 4, 5]');
    expect(result.changed).toBe(true);
  });

  test('array sized declaration', () => {
    const result = declarationConverters.arrayDecl('String[] names = new String[10];', '    ');
    expect(result.code).toBe('    DECLARE names : ARRAY[10] OF STRING');
    expect(result.changed).toBe(true);
  });
});

describe('Java2IB Comprehensive Integration Tests', () => {
  const parser = new Java2IB();
  
  test('complete class with methods and control structures', () => {
    const input = `public class ArrayProcessor {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 8, 1, 9};
        int max = findMaximum(numbers);
        System.out.println("Maximum: " + max);
    }
    
    public int findMaximum(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
}`;
    
    const expected = `CLASS ArrayProcessor
    PROCEDURE main(String[] args)
        DECLARE numbers ← [5, 2, 8, 1, 9]
        max ← findMaximum(numbers)
        OUTPUT "Maximum: " + max
    END PROCEDURE
    
    FUNCTION findMaximum(int[] arr)
        max ← arr[0]
        FOR i FROM 1 TO arr.length DO
            IF arr[i] > max THEN
                max ← arr[i]
            END IF
        END FOR
        RETURN max
    END FUNCTION
END CLASS`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('nested control structures with arrays', () => {
    const input = `if (x > 0) {
      for (int i = 1; i <= x; i++) {
          System.out.print(i);
      }
  } else if (x < 0) {
      System.out.println("Negative");
  } else {
      System.out.println("Zero");
  }`;
    
    const expected = `IF x > 0 THEN
      FOR i FROM 1 TO x DO
          OUTPUT i
      END FOR
  ELSE IF x < 0 THEN
      OUTPUT "Negative"
  ELSE
      OUTPUT "Zero"
  END IF`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('while loop with compound assignments', () => {
    const input = `int sum = 0;
int i = 1;
while (i <= 10) {
    sum += i;
    i++;
}
System.out.println(sum);`;
    
    const expected = `DECLARE sum ← 0
DECLARE i ← 1
WHILE i ≤ 10 DO
    sum ← sum + i
    i ← i + 1
END WHILE
OUTPUT sum`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('do-while loop structure', () => {
    const input = `do {
    System.out.println("Enter a number:");
    x = scanner.nextInt();
} while (x != 0);`;
    
    const expected = `REPEAT
    OUTPUT "Enter a number:"
    INPUT x
END REPEAT`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('try-catch-finally blocks', () => {
    const input = `try {
    int result = divide(a, b);
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Division by zero");
} finally {
    System.out.println("Cleanup");
}`;
    
    const expected = `TRY
    result ← divide(a, b)
    OUTPUT result
CATCH ArithmeticException
    OUTPUT "Division by zero"
FINALLY
    OUTPUT "Cleanup"
END TRY`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('for-each loop with collections', () => {
    const input = `for (String name : names) {
    System.out.println(name);
}`;
    
    const expected = `FOR EACH name IN names DO
    OUTPUT name
END FOR`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('mathematical expressions and functions', () => {
    const input = `double area = Math.pow(radius, 2) * 3.14159;
double distance = Math.sqrt(x*x + y*y);
int absolute = Math.abs(value);`;
    
    const expected = `area ← radius ^ 2 * 3.14159
distance ← √(x*x + y*y)
absolute ← ABS(value)`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('array operations and indexing', () => {
    const input = `int[] scores = new int[5];
scores[0] = 95;
scores[1] = 87;
int total = scores[0] + scores[1];`;
    
    const expected = `DECLARE scores : ARRAY[5] OF INT
scores[0] ← 95
scores[1] ← 87
total ← scores[0] + scores[1]`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('input operations with different data types', () => {
    const input = `int age = scanner.nextInt();
String name = scanner.nextLine();
double salary = scanner.nextDouble();
boolean isActive = scanner.nextBoolean();`;
    
    const expected = `INPUT age
INPUT name
INPUT salary
INPUT isActive`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('complex conditional expressions', () => {
    const input = `if (age >= 18 && hasLicense && !isSuspended) {
    System.out.println("Can drive");
} else if (age >= 16 && hasPermit) {
    System.out.println("Can drive with supervision");
} else {
    System.out.println("Cannot drive");
}`;
    
    const expected = `IF age ≥ 18 AND hasLicense AND NOT isSuspended THEN
    OUTPUT "Can drive"
ELSE IF age ≥ 16 AND hasPermit THEN
    OUTPUT "Can drive with supervision"
ELSE
    OUTPUT "Cannot drive"
END IF`;
    
    expect(parser.parse(input)).toBe(expected);
  });
});

// Python to IB Pseudocode Tests
describe('Python2IB Comprehensive Tests', () => {
  const parser = new IBParser();

  test('basic variable assignments and operations', () => {
    const input = `x = 5
y = 10
z = x + y
print(z)`;
    
    const expected = `x ← 5
y ← 10
z ← x + y
OUTPUT z`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('if-elif-else structures', () => {
    const input = `if score >= 90:
    print("A grade")
elif score >= 80:
    print("B grade")
elif score >= 70:
    print("C grade")
else:
    print("F grade")`;
    
    const expected = `IF score ≥ 90 THEN
    OUTPUT "A grade"
ELSE IF score ≥ 80 THEN
    OUTPUT "B grade"
ELSE IF score ≥ 70 THEN
    OUTPUT "C grade"
ELSE
    OUTPUT "F grade"
END IF`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('for loops with range', () => {
    const input = `for i in range(5):
    print(i)

for j in range(1, 10):
    print(j)

for k in range(0, 20, 2):
    print(k)`;
    
    const expected = `loop i from 0 to 4
    OUTPUT i
end loop

loop j from 1 to 9
    OUTPUT j
end loop

loop k from 0 to 19
    OUTPUT k
end loop`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('while loops', () => {
    const input = `count = 0
while count < 10:
    print(count)
    count += 1`;
    
    const expected = `count ← 0
WHILE count < 10 DO
    OUTPUT count
    count ← count + 1
END WHILE`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('function definitions', () => {
    const input = `def calculate_area(length, width):
    area = length * width
    return area

def print_message(msg):  # procedure
    print(msg)`;
    
    const expected = `FUNCTION calculate_area(length, width)
    area ← length * width
    RETURN area
END FUNCTION

PROCEDURE print_message(msg)
    OUTPUT msg
END PROCEDURE`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('class definitions', () => {
    const input = `class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def display_info(self):
        print(f"Name: {self.name}, Age: {self.age}")`;
    
    const expected = `CLASS Student
    FUNCTION __init__(self, name, age)
        self.name ← name
        self.age ← age
    END FUNCTION
    
    PROCEDURE display_info(self)
        OUTPUT f"Name: {self.name}, Age: {self.age}"
    END PROCEDURE
END CLASS`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('for loops with collections', () => {
    const input = `for item in collection:
    print(item)`;
    
    const expected = `collection.resetNext()
loop while collection.hasNext()
    item ← collection.getNext()
    OUTPUT item
end loop`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('try-except-finally blocks', () => {
    const input = `try:
    result = 10 / 0
    print(result)
except ZeroDivisionError:
    print("Cannot divide by zero")
finally:
    print("Cleanup complete")`;
    
    const expected = `TRY
    result ← 10 / 0
    OUTPUT result
CATCH ZeroDivisionError
    OUTPUT "Cannot divide by zero"
FINALLY
    OUTPUT "Cleanup complete"
END TRY`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('input operations', () => {
    const input = `name = input("Enter your name: ")
age = input("Enter your age: ")
print(f"Hello {name}, you are {age} years old")`;
    
    const expected = `INPUT name
INPUT age
OUTPUT f"Hello {name}, you are {age} years old"`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('compound assignment operators', () => {
    const input = `x += 5
y -= 3
z *= 2
a /= 4
b %= 3
c //= 2
d **= 3`;
    
    const expected = `x ← x + 5
y ← y - 3
z ← z * 2
a ← a / 4
b ← b mod 3
c ← c div 2
d ← d ^ 3`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('logical and comparison operators', () => {
    const input = `if x == 5 and y != 10 or z >= 20:
    print("Condition met")

if not (a <= b):
    print("A is greater than B")`;
    
    const expected = `IF x = 5 AND y ≠ 10 OR z ≥ 20 THEN
    OUTPUT "Condition met"
END IF

IF NOT (a ≤ b) THEN
    OUTPUT "A is greater than B"
END IF`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('comments conversion', () => {
    const input = `# This is a comment
x = 5  # Another comment
print(x)`;
    
    const expected = `// This is a comment
x ← 5  // Another comment
OUTPUT x`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('repeat loops (special comment)', () => {
    const input = `while True:  # repeat
    user_input = input("Enter command: ")
    if user_input == "quit":
        break
    print(f"You entered: {user_input}")`;
    
    const expected = `REPEAT
    INPUT user_input
    IF user_input = "quit" THEN
        break
    END IF
    OUTPUT f"You entered: {user_input}"
end loop`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('nested structures with proper indentation', () => {
    const input = `for i in range(3):
    for j in range(3):
        if i == j:
            print(f"Diagonal: ({i}, {j})")
        else:
            print(f"Off-diagonal: ({i}, {j})")`;
    
    const expected = `loop i from 0 to 2
    loop j from 0 to 2
        IF i = j THEN
            OUTPUT f"Diagonal: ({i}, {j})"
        ELSE
            OUTPUT f"Off-diagonal: ({i}, {j})"
        END IF
    end loop
end loop`;
    
    expect(parser.parse(input)).toBe(expected);
  });

  test('complex data structures and operations', () => {
    const input = `numbers = [1, 2, 3, 4, 5]
total = 0
for num in numbers:
    total += num
average = total / len(numbers)
print(f"Average: {average}")`;
    
    const expected = `numbers ← [1, 2, 3, 4, 5]
total ← 0
numbers.resetNext()
loop while numbers.hasNext()
    num ← numbers.getNext()
    total ← total + num
end loop
average ← total / len(numbers)
OUTPUT f"Average: {average}"`;
    
    expect(parser.parse(input)).toBe(expected);
  });
});
