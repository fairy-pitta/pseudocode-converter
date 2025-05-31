import { Java2IB } from './lib/java-to-pseudocode-parser-ib';

const parser = new Java2IB();

const input = `if (x > 0) {
      for (int i = 1; i <= x; i++) {
          System.out.print(i);
      }
  }
  else if (x < 0) {
      System.out.println("Neg");
  }
  else {
      System.out.println("Zero");
  }`;

const result = parser.parse(input);
console.log('Actual output:');
console.log(JSON.stringify(result));
console.log('\nActual output (formatted):');
console.log(result);

const expected = `IF x > 0 THEN
      FOR i FROM 1 TO x DO
          OUTPUT i
      END FOR
  ELSE IF x < 0 THEN
      OUTPUT "Neg"
  ELSE
      OUTPUT "Zero"
  END IF`;

console.log('\nExpected output:');
console.log(JSON.stringify(expected));
console.log('\nExpected output (formatted):');
console.log(expected);