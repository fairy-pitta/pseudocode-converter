import { Card } from "@/components/ui/card"

export function CambridgeConversionRules() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🔹 Cambridge International Pseudocode Conversion Rules (2026)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BasicSyntaxTable />
        <ControlStructuresTable />
        <OperatorsTable />
      </div>
    </Card>
  )
}

function BasicSyntaxTable() {
  const rules = [
    { python: "# comment", pseudocode: "// comment" },
    { python: "x = 5", pseudocode: "x ← 5" },
    { python: "print(x, y)", pseudocode: "output x, y" },
    { python: "x = input()", pseudocode: "input x" },
    { python: "A[0]", pseudocode: "A[1]" },
  ]

  return (
    <div>
      <h4 className="font-medium mb-2">Basic Syntax</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">Cambridge</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-mono text-xs">{rule.python}</td>
              <td className="py-2 font-mono text-xs">{rule.pseudocode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ControlStructuresTable() {
  const rules = [
    { python: "if x == 0:", pseudocode: "IF x = 0 THEN" },
    { python: "for i in range(1, 6):", pseudocode: "FOR i ← 1 TO 5" },
    { python: "while x < 10:", pseudocode: "WHILE x < 10 DO" },
    { python: "def add(a, b):", pseudocode: "FUNCTION add(a, b)" },
  ]

  return (
    <div>
      <h4 className="font-medium mb-2">Control Structures</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">Cambridge</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-mono text-xs">{rule.python}</td>
              <td className="py-2 font-mono text-xs">{rule.pseudocode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OperatorsTable() {
  const rules = [
    { python: "a // b", pseudocode: "a DIV b" },
    { python: "a % b", pseudocode: "a MOD b" },
    { python: "and, or, not", pseudocode: "AND, OR, NOT" },
    { python: "==, !=", pseudocode: "=, <>" },
    { python: "**", pseudocode: "^" },
  ]

  return (
    <div>
      <h4 className="font-medium mb-2">Operators</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">Cambridge</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-mono text-xs">{rule.python}</td>
              <td className="py-2 font-mono text-xs">{rule.pseudocode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
