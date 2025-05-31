import { IGCSEPseudocodeParser } from './lib/python-igcse/parser';

const pythonCode = `if score >= 50:
    print("Pass")
else:
    print("Fail")`;

const parser = new IGCSEPseudocodeParser();

// Add debug logging to see what's happening
const originalProcessLine = (parser as any).processLine;
(parser as any).processLine = function(line: string) {
  console.log(`Processing line: "${line}"`);
  console.log(`Current blocks:`, this.state.currentBlockTypes.map((b: any) => b.type));
  console.log(`Indentation levels:`, this.state.indentationLevels);
  
  const result = originalProcessLine.call(this, line);
  
  console.log(`After processing:`);
  console.log(`Current blocks:`, this.state.currentBlockTypes.map((b: any) => b.type));
  console.log(`Output lines:`, this.state.outputLines);
  console.log(`---`);
  
  return result;
};

const result = parser.parse(pythonCode);
console.log('\nFinal result:');
console.log(result);