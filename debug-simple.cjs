const { Java2IB } = require('./dist/java-ib/index.js');

const parser = new Java2IB();
const javaCode = 'int a = 10;';
const result = parser.parse(javaCode);

console.log('Input:', javaCode);
console.log('Output:', result);
console.log('Output (JSON):', JSON.stringify(result));