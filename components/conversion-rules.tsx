import { Card } from "@/components/ui/card"

export function ConversionRules() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🔹 IB疑似コード変換ルール</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicSyntaxTable />
        <ControlStructuresTable />
      </div>
    </Card>
  )
}

function BasicSyntaxTable() {
  const rules = [
    { python: "# comment", pseudocode: "// comment" },
    { python: "x = 5", pseudocode: "x ← 5" },
    { python: "print(x)", pseudocode: "OUTPUT x" },
    { python: "x = input()", pseudocode: "x ← INPUT()" },
  ]

  return (
    <div>
      <h4 className="font-medium mb-2">基本構文</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">IB Pseudocode</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-mono">{rule.python}</td>
              <td className="py-2 font-mono">{rule.pseudocode}</td>
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
    { python: "for i in range(1, 6):", pseudocode: "FOR i ← 1 TO 5 DO" },
    { python: "while x < 10:", pseudocode: "WHILE x < 10 DO" },
    { python: "def add(a, b):", pseudocode: "FUNCTION add(a, b)" },
  ]

  return (
    <div>
      <h4 className="font-medium mb-2">条件分岐とループ</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">IB Pseudocode</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 font-mono">{rule.python}</td>
              <td className="py-2 font-mono">{rule.pseudocode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
