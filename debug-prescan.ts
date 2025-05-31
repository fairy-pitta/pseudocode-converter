import { PATTERNS } from './lib/python-igcse/patterns';

const pythonCode = `student = {"name": "John", "age": 20}
print(student["name"])
student["grade"] = "A"`;

const lines = pythonCode.split(/\r?\n/);

console.log('Pre-scanning for dictionary fields...');

const typeFields = new Map<string, Set<string>>();

lines.forEach((line, index) => {
  console.log(`Line ${index}: ${line}`);
  
  // Check for dictionary literal
  const dictLiteralMatch = line.match(PATTERNS.DICTIONARY_LITERAL);
  if (dictLiteralMatch) {
    const [, variable, content] = dictLiteralMatch;
    console.log(`  Found dictionary literal for ${variable}: ${content}`);
    
    if (!typeFields.has(variable)) {
      typeFields.set(variable, new Set());
    }
    
    const pairs = content.split(',').map(pair => {
      const [key] = pair.split(':').map(s => s.trim());
      return key.replace(/["']/g, '');
    });
    
    pairs.forEach(key => {
      typeFields.get(variable)!.add(key);
      console.log(`    Added field: ${key}`);
    });
  }
  
  // Check for dictionary assignment
  const dictAssignMatch = line.match(PATTERNS.DICTIONARY_ASSIGNMENT);
  if (dictAssignMatch) {
    const [, variable, key] = dictAssignMatch;
    const cleanKey = key.replace(/["']/g, '');
    console.log(`  Found dictionary assignment for ${variable}.${cleanKey}`);
    
    if (!typeFields.has(variable)) {
      typeFields.set(variable, new Set());
    }
    
    typeFields.get(variable)!.add(cleanKey);
    console.log(`    Added field: ${cleanKey}`);
  }
});

console.log('\nFinal type fields:');
for (const [variable, fields] of typeFields) {
  console.log(`${variable}: [${Array.from(fields).join(', ')}]`);
}