import { Java2IB } from './lib/java-to-pseudocode-parser-ib.ts';

const parser = new Java2IB();

const javaCode = `int p = 10;
int q = 5;
boolean isEqual = (p == q);
boolean isNotEqual = (p != q);
boolean isGreater = (p > q);
boolean isGreaterOrEqual = (p >= q);
boolean isLess = (p < q);
boolean isLessOrEqual = (p <= q);`;

console.log('Java Code:');
console.log(javaCode);
console.log('\nActual Pseudocode:');
const result = parser.parse(javaCode);
console.log(result);

console.log('\nExpected Pseudocode:');
console.log(`P ← 10
Q ← 5
ISEQUAL ← (P = Q)
ISNOTEQUAL ← (P ≠ Q)
ISGREATER ← (P > Q)
ISGREATEROREQUAL ← (P >= Q)
ISLESS ← (P < Q)
ISLESSOREQUAL ← (P <= Q)`);