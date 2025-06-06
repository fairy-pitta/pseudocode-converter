import { Java2IB } from '@/lib/java-to-pseudocode-parser-ib';

describe('Java to IB Pseudocode Parser', () => {
  let parser: Java2IB;

  beforeEach(() => {
    parser = new Java2IB();
  });


  test('should convert variable declaration and assignment for int, String, boolean', () => {
    const javaCode = `int count = 10;\nString name = "Test";\nboolean flag = true;`;
    const expectedPseudocode = `COUNT ← 10\nNAME ← "Test"\nFLAG ← TRUE`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert System.out.println to output', () => {
    const javaCode = `System.out.println("Hello World");\nSystem.out.println(count);`;
    const expectedPseudocode = `output "Hello World"\noutput COUNT`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert simple if statement', () => {
    const javaCode = `int x = 10;\nif (x > 5) {\n    System.out.println("Greater");\n}`;
    const expectedPseudocode = `X ← 10\nif X > 5 then\n    output "Greater"\nend if`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert if-else statement', () => {
    const javaCode = `int y = 0;\nif (y < 5) {\n    System.out.println("Less");\n} else {\n    System.out.println("Not less");\n}`;
    const expectedPseudocode = `Y ← 0\nif Y < 5 then\n    output "Less"\nelse\n    output "Not less"\nend if`;
    const actualPseudocode = parser.parse(javaCode);
    
    console.log('=== DEBUG: if-else statement ===');
    console.log('Java Code:');
    console.log(javaCode);
    console.log('\nExpected:');
    console.log(expectedPseudocode);
    console.log('\nActual:');
    console.log(actualPseudocode);
    console.log('\nCharacter comparison:');
    for (let i = 0; i < Math.max(expectedPseudocode.length, actualPseudocode.length); i++) {
      const expected = expectedPseudocode[i] || 'EOF';
      const actual = actualPseudocode[i] || 'EOF';
      if (expected !== actual) {
        console.log(`Position ${i}: expected '${expected}' (${expected.charCodeAt(0)}), got '${actual}' (${actual.charCodeAt(0)})`);
        break;
      }
    }
    console.log('================================');
    
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert for loop (increment)', () => {
    const javaCode = `for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}`;
    const expectedPseudocode = `loop I from 0 to 2\n    output I\nend loop`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert while loop', () => {
    const javaCode = `int k = 0;\nwhile (k < 3) {\n    System.out.println(k);\n    k++;\n}`;
    const expectedPseudocode = `K ← 0\nloop while K < 3\n    output K\n    K ← K + 1\nend loop`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert arithmetic operations', () => {
    debugger;
    const javaCode = `int a = 10;\nint b = 5;\nint sum = a + b;\nint diff = a - b;\nint prod = a * b;\nint quot = a / b;\nint rem = a % b;`;
    const expectedPseudocode = `A ← 10\nB ← 5\nSUM ← A + B\nDIFF ← A - B\nPROD ← A * B\nQUOT ← A div B\nREM ← A mod B`;
    
    console.log("Testing individual lines:");
    const lines = javaCode.split('\n');
    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: "${line}"`);
      const result = parser.parse(line);
      console.log(`Result: "${result}"`);
    });
    
    const actualPseudocode = parser.parse(javaCode);
    console.log("Java Code:\n", javaCode);
    console.log("Expected Pseudocode:\n", expectedPseudocode);
    console.log("Actual Pseudocode:\n", actualPseudocode);
    
    // 詳細な比較
    const expectedLines = expectedPseudocode.split('\n');
    const actualLines = actualPseudocode.split('\n');
    console.log("Line by line comparison:");
    for (let i = 0; i < Math.max(expectedLines.length, actualLines.length); i++) {
      const expected = expectedLines[i] || '[missing]';
      const actual = actualLines[i] || '[missing]';
      console.log(`Line ${i + 1}: Expected="${expected}", Actual="${actual}", Match=${expected === actual}`);
    }
    
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert increment and decrement operations', () => {
    const javaCode = `int val = 5;
val++;
int anotherVal = 10;
anotherVal--;`;
    const expectedPseudocode = `VAL ← 5
VAL ← VAL + 1
ANOTHERVAL ← 10
ANOTHERVAL ← ANOTHERVAL - 1`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert comparison operations', () => {
    debugger;
    const javaCode = `int p = 10;
int q = 5;
boolean isEqual = (p == q);
boolean isNotEqual = (p != q);
boolean isGreater = (p > q);
boolean isGreaterOrEqual = (p >= q);
boolean isLess = (p < q);
boolean isLessOrEqual = (p <= q);`;
    const expectedPseudocode = `P ← 10
Q ← 5
ISEQUAL ← (P = Q)
ISNOTEQUAL ← (P ≠ Q)
ISGREATER ← (P > Q)
ISGREATEROREQUAL ← (P >= Q)
ISLESS ← (P < Q)
ISLESSOREQUAL ← (P <= Q)`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("--- Test: should convert comparison operations ---");
    console.log("Java Code:\n", javaCode);
    console.log("Expected Pseudocode:\n", expectedPseudocode);
    console.log("Actual Pseudocode:\n", actualPseudocode);
    console.log("Comparison of >= operator:");
    console.log("Expected: '>='");
    const match = actualPseudocode.match(/ISGREATEROREQUAL ← \(P (.+) Q\)/);
    console.log("Actual: '" + (match ? match[1] : 'no match') + "'");
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert logical operations', () => {
    debugger;
    const javaCode = `boolean condition1 = true;\nboolean condition2 = false;\nboolean resultAnd = condition1 && condition2;\nboolean resultOr = condition1 || condition2;\nboolean resultNot = !condition1;`;
    const expectedPseudocode = `CONDITION1 ← TRUE\nCONDITION2 ← FALSE\nRESULTAND ← CONDITION1 AND CONDITION2\nRESULTOR ← CONDITION1 OR CONDITION2\nRESULTNOT ← NOT CONDITION1`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("--- Test: should convert logical operations ---");
    console.log("Java Code:\n", javaCode);
    console.log("Expected Pseudocode:\n", expectedPseudocode);
    console.log("Actual Pseudocode:\n", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert string concatenation', () => {
    const javaCode = `String firstName = "John";\nString lastName = "Doe";\nString fullName = firstName + " " + lastName;`;
    // IB Pseudocode rules don't explicitly show string concatenation, but '+' or '&' are common.
    // Python IB test used '+'. We'll assume '+' for now.
    const expectedPseudocode = `FIRSTNAME ← "John"\nLASTNAME ← "Doe"\nFULLNAME ← FIRSTNAME + " " + LASTNAME`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("--- Test: should convert string concatenation ---");
    console.log("Java Code:\n", javaCode);
    console.log("Expected Pseudocode:\n", expectedPseudocode);
    console.log("Actual Pseudocode:\n", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  // Future tests could include:
  // - Input (e.g., Scanner)
  // - Arrays (declaration, access, iteration)
  // - Method/Function calls (if applicable to IB spec)
  // - Comments

  test('should convert nested if statements', () => {
    const javaCode = `int x = 10;
int y = 5;
if (x > 0) {
    if (y > 0) {
        System.out.println("Both positive");
    }
}`;
    const expectedPseudocode = `X ← 10
Y ← 5
if X > 0 then
    if Y > 0 then
        output "Both positive"
    end if
end if`;
    const actualPseudocode = parser.parse(javaCode);
    
    console.log('=== DEBUG: nested if statements ===');
    console.log('Java Code:');
    console.log(javaCode);
    console.log('\nExpected:');
    console.log(expectedPseudocode);
    console.log('\nActual:');
    console.log(actualPseudocode);
    console.log('\nActual (JSON.stringify):');
    console.log(JSON.stringify(actualPseudocode));
    console.log('\nExpected (JSON.stringify):');
    console.log(JSON.stringify(expectedPseudocode));
    console.log('\nActual (split by lines):');
    console.log(actualPseudocode.split('\n'));
    console.log('\nExpected (split by lines):');
    console.log(expectedPseudocode.split('\n'));
    console.log('\nCharacter comparison:');
    for (let i = 0; i < Math.max(expectedPseudocode.length, actualPseudocode.length); i++) {
      const expected = expectedPseudocode[i] || 'EOF';
      const actual = actualPseudocode[i] || 'EOF';
      if (expected !== actual) {
        console.log(`Position ${i}: expected '${expected}' (${expected.charCodeAt(0)}), got '${actual}' (${actual.charCodeAt(0)})`);
        break;
      }
    }
    console.log('================================');
    
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert if-else-if-else chain', () => {
    const javaCode = `int score = 85;
String grade;
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else {
    grade = "C";
}}`;
    const expectedPseudocode = `SCORE ← 85
GRADE
if SCORE >= 90 then
    GRADE ← "A"
else
    if SCORE >= 80 then
        GRADE ← "B"
    else
        GRADE ← "C"
    end if
end if`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("--- Test: should convert if-else-if-else chain ---");
    console.log("Java Code:\n", javaCode);
    console.log("Expected Pseudocode:\n", expectedPseudocode);
    console.log("Actual Pseudocode:\n", actualPseudocode);
    console.log("Expected Pseudocode (JSON):", JSON.stringify(expectedPseudocode));
    console.log("Actual Pseudocode (JSON):", JSON.stringify(actualPseudocode));
    
    // 詳細な差分を表示
    console.log('Detailed Difference:');
    const expectedLines = expectedPseudocode.split('\n');
    const actualLines = actualPseudocode.split('\n');
    for(let i=0; i<Math.max(expectedLines.length, actualLines.length); i++) {
      const expLine = expectedLines[i] || '';
      const actLine = actualLines[i] || '';
      if(expLine !== actLine) {
        console.log(`Line ${i+1}: Expected: '${expLine}', Actual: '${actLine}'`);
      }
    }
    
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert complex arithmetic expressions', () => {
    const javaCode = `int a = 5;
int b = 3;
int c = 10;
int d = 2;
int e = 7;
int f = 4;
int g = 3;
int result = (a + b) * (c - d) / (e + f % g);`;
    const expectedPseudocode = `A ← 5
B ← 3
C ← 10
D ← 2
E ← 7
F ← 4
G ← 3
RESULT ← (A + B) * (C - D) div (E + F mod G)`;
    const actualPseudocode = parser.parse(javaCode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });
});