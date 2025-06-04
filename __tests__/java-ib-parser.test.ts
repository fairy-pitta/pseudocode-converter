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
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert System.out.println to output', () => {
    const javaCode = `System.out.println("Hello World");\nSystem.out.println(count);`;
    const expectedPseudocode = `output "Hello World"\noutput COUNT`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert simple if statement', () => {
    const javaCode = `int x = 10;\nif (x > 5) {\n    System.out.println("Greater");\n}`;
    const expectedPseudocode = `X ← 10\nif X > 5 then\n    output "Greater"\nend if`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Expected output:", expectedPseudocode);
    console.log("Actual output:", actualPseudocode);
    console.log("Expected output (JSON):", JSON.stringify(expectedPseudocode));
    console.log("Actual output (JSON):", JSON.stringify(actualPseudocode));
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert if-else statement', () => {
    const javaCode = `int y = 0;\nif (y < 5) {\n    System.out.println("Less");\n} else {\n    System.out.println("Not less");\n}`;
    const expectedPseudocode = `Y ← 0\nif Y < 5 then\n    output "Less"\nelse\n    output "Not less"\nend if`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert for loop (increment)', () => {
    const javaCode = `for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}`;
    const expectedPseudocode = `loop I from 0 to 2\n    output I\nend loop`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  // Note: IB pseudocode typically doesn't have a direct equivalent for `i--` in the loop definition.
  // This would usually be handled by adjusting loop bounds or using a while loop.
  // For simplicity, we'll assume a transformation or skip this specific decrementing for loop test for now.

  test('should convert while loop', () => {
    const javaCode = `int k = 0;\nwhile (k < 3) {\n    System.out.println(k);\n    k++;\n}`;
    const expectedPseudocode = `K ← 0\nloop while K < 3\n    output K\n    K ← K + 1\nend loop`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Expected pseudocode:", expectedPseudocode);
    console.log("Actual pseudocode:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert arithmetic operations', () => {
    const javaCode = `int a = 10;\nint b = 5;\nint sum = a + b;\nint diff = a - b;\nint prod = a * b;\nint quot = a / b;\nint rem = a % b;`;
    const expectedPseudocode = `A ← 10\nB ← 5\nSUM ← A + B\nDIFF ← A - B\nPROD ← A * B\nQUOT ← A DIV B\nREM ← A MOD B`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("=== 算術演算テスト ===");
    console.log("Java code:", javaCode);
    console.log("Expected:", expectedPseudocode);
    console.log("Actual:", actualPseudocode);
    console.log("Expected (JSON):", JSON.stringify(expectedPseudocode));
    console.log("Actual (JSON):", JSON.stringify(actualPseudocode));
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert increment and decrement operations', () => {
    const javaCode = `int val = 5;\nval++;\nint anotherVal = 10;\notherVal--;`;
    const expectedPseudocode = `VAL ← 5\nVAL ← VAL + 1\nANOTHERVAL ← 10\nANOTHERVAL ← ANOTHERVAL - 1`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert comparison operations', () => {
    const javaCode = `int p = 10;\nint q = 5;\nboolean isEqual = (p == q);\nboolean isNotEqual = (p != q);\nboolean isGreater = (p > q);\nboolean isGreaterOrEqual = (p >= q);\nboolean isLess = (p < q);\nboolean isLessOrEqual = (p <= q);`;
    // IB Pseudocode uses single '=' for comparison in IF, but assignment uses '='.
    // For boolean assignment, we'll assume direct mapping of comparison result.
    // The IB rules show `if X = 4 then` for comparison.
    const expectedPseudocode = `P ← 10\nQ ← 5\nISEQUAL ← (P = Q)\nISNOTEQUAL ← (P ≠ Q)\nISGREATER ← (P > Q)\nISGREATEROREQUAL ← (P >= Q)\nISLESS ← (P < Q)\nISLESSOREQUAL ← (P <= Q)`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert logical operations', () => {
    const javaCode = `boolean condition1 = true;\nboolean condition2 = false;\nboolean resultAnd = condition1 && condition2;\nboolean resultOr = condition1 || condition2;\nboolean resultNot = !condition1;`;
    const expectedPseudocode = `CONDITION1 ← TRUE\nCONDITION2 ← FALSE\nRESULTAND ← CONDITION1 AND CONDITION2\nRESULTOR ← CONDITION1 OR CONDITION2\nRESULTNOT ← NOT CONDITION1`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  test('should convert string concatenation', () => {
    const javaCode = `String firstName = "John";\nString lastName = "Doe";\nString fullName = firstName + " " + lastName;`;
    // IB Pseudocode rules don't explicitly show string concatenation, but '+' or '&' are common.
    // Python IB test used '+'. We'll assume '+' for now.
    const expectedPseudocode = `FIRSTNAME ← "John"\nLASTNAME ← "Doe"\nFULLNAME ← FIRSTNAME + " " + LASTNAME`;
    const actualPseudocode = parser.parse(javaCode);
    console.log("Actual output for System.out.println:", actualPseudocode);
    expect(actualPseudocode).toBe(expectedPseudocode);
  });

  // Future tests could include:
  // - Input (e.g., Scanner)
  // - Arrays (declaration, access, iteration)
  // - Method/Function calls (if applicable to IB spec)
  // - Comments
});