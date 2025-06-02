const fs = require('fs');
const { IGCSEPseudocodeParser } = require('./parser');

if (process.argv.length < 3) {
  console.error('Usage: node index.js <python-file>');
  process.exit(1);
}

const filename = process.argv[2];

try {
  const pythonCode = fs.readFileSync(filename, 'utf8');
  const parser = new IGCSEPseudocodeParser();
  const pseudocode = parser.parse(pythonCode);
  
  console.log('=== Python to IGCSE Pseudocode Conversion ===');
  console.log('Input Python code:');
  console.log(pythonCode);
  console.log('\n=== Converted Pseudocode ===');
  console.log(pseudocode);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}