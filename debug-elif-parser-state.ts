import { IGCSEPseudocodeParser } from './lib/python-igcse/parser';

const parser = new IGCSEPseudocodeParser();

const pythonCode = `if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")`;

console.log('Python Code:');
console.log(pythonCode);
console.log('\n=== Processing ===');

// Override the processLine method to add debugging
const originalProcessLine = (parser as any).processLine;
(parser as any).processLine = function(line: string) {
  console.log(`\nProcessing line: "${line}"`);
  console.log('Current blocks:', this.state.currentBlockTypes.map((b: any) => b.type));
  console.log('Indentation levels:', this.state.indentationLevels);
  console.log('Output lines so far:', this.state.outputLines.length);
  
  const result = originalProcessLine.call(this, line);
  
  console.log('After processing:');
  console.log('Current blocks:', this.state.currentBlockTypes.map((b: any) => b.type));
  console.log('Indentation levels:', this.state.indentationLevels);
  console.log('Latest output line:', this.state.outputLines[this.state.outputLines.length - 1]);
  
  return result;
};

const result = parser.parse(pythonCode);

console.log('\n=== Final Result ===');
console.log(result);