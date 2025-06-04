import { Java2IB } from './dist/java-ib/index.js';

const parser = new Java2IB();
const javaCode = 'int a = 10;';
const result = parser.parse(javaCode);

console.log('Input:', javaCode);
console.log('Output:', result);
console.log('Output (JSON):', JSON.stringify(result));

// Test arithmetic operations
const arithmeticCode = 'int sum = a + b;';
const arithmeticResult = parser.parse(arithmeticCode);
console.log('\nArithmetic Input:', arithmeticCode);
console.log('Arithmetic Output:', arithmeticResult);
console.log('Arithmetic Output (JSON):', JSON.stringify(arithmeticResult));