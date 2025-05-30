import { CambridgeConversionRules } from "@/components/cambridge-conversion-rules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CambridgeRulesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Cambridge International Pseudocode Guide (2026)
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            A comprehensive guide to the pseudocode specification for Cambridge International AS & A Level Computer Science (9618) 2026 examinations.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="format">Format & Types</TabsTrigger>
              <TabsTrigger value="control">Control Structures</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <h3 className="text-lg font-semibold">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fixed-width font with 3-space indentation (optional with line numbers)</li>
                <li>UPPERCASE keywords (IF, REPEAT, PROCEDURE, etc.)</li>
                <li>Mixed-case identifiers (e.g., NumberOfPlayers)</li>
                <li>Single-line comments with //</li>
                <li>Meta-variables in angle brackets: &lt;identifier&gt;</li>
              </ul>
            </TabsContent>

            <TabsContent value="format" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Types & Literals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Basic Types</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>INTEGER: 0, -3</li>
                      <li>REAL: 4.7, 0.0</li>
                      <li>CHAR: 'A', '@'</li>
                      <li>STRING: "hello", ""</li>
                      <li>BOOLEAN: TRUE, FALSE</li>
                      <li>DATE: 31/12/2025</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Declarations</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Variables: DECLARE Counter : INTEGER</li>
                      <li>Constants: CONSTANT Pi = 3.14159</li>
                      <li>Assignment: total ← price * qty</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Arrays</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm">
{`DECLARE marks : ARRAY[1:30] OF INTEGER    // 1D
DECLARE board : ARRAY[1:3,1:3] OF CHAR    // 2D
score ← marks[i]
board[2,3] ← 'X'`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Operators & Functions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Operators</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Arithmetic: + - * / ^ MOD DIV</li>
                      <li>Relational: = &lt;&gt; &lt; &lt;= &gt; &gt;=</li>
                      <li>Logical: AND OR NOT</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Functions</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>String: LEN(s), LEFT(s,n), MID(s,i,n)</li>
                      <li>Numeric: ROUND(x), ABS(x), RANDOM_INT(a,b)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="control" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Control Structures</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Selection</h4>
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm">
{`IF grade >= 50 THEN
    output "Pass"
ELSE IF grade >= 45 THEN
    output "Resit"
ELSE
    output "Fail"
ENDIF`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Iteration</h4>
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm">
{`FOR i ← 1 TO 10
    output i
NEXT i

REPEAT
    input n
UNTIL n <> 0

WHILE queueNotEmpty DO
    Dequeue()
ENDWHILE`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Subroutines</h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm">
{`PROCEDURE swap(BYREF x : INTEGER, y : INTEGER)
    temp ← x
    x ← y
    y ← temp
ENDPROCEDURE

FUNCTION area(r : REAL) RETURNS REAL
    RETURN 3.14 * r ^ 2
ENDFUNCTION`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Python to Pseudocode Conversion</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Considerations</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Use Abstract Syntax Tree (AST) for conversion</li>
                      <li>Indentation: 3 spaces × nesting depth</li>
                      <li>Handle Python-specific features (list comprehensions, try/except, with statements)</li>
                      <li>Type conversion: list → ARRAY, dict/set → custom types</li>
                      <li>Operator mapping: // → DIV, % → MOD</li>
                      <li>Boolean values: True/False → TRUE/FALSE</li>
                      <li>I/O conversion: print() → output, input() → input var</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Keyword Mapping</h4>
                    <pre className="bg-gray-50 p-4 rounded-lg text-sm">
{`MAP = {
    ast.If: "IF {cond} THEN",
    ast.For: "FOR {target} ← {start} TO {end}",
    ast.While: "WHILE {cond} DO",
    ast.FunctionDef: "PROCEDURE {name}({params})",
    ast.Call of print(): "output {args}",
    ast.Call of input(): "input {var}"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
