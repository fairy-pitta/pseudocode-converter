import { Card } from "@/components/ui/card"

/**
 * IBConversionRules.tsx
 * 
 * A reusable card component that lists the core Python → IB-style pseudocode rules
 *   • Basic syntax
 *   • Control / loop structures (with END clauses)
 *   • Operators & arithmetic keywords
 *   • Additional blocks (REPEAT-UNTIL, CASE OF, data-structure helpers)
 *
 * Tailwind & shadcn/ui only – no runtime logic.
 */
export function IBConversionRules() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        🔹 IB Computer Science Official Pseudocode Conversion Rules
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="min-w-0"><BasicSyntaxTable /></div>
        <div className="min-w-0"><ControlStructuresTable /></div>
        <div className="min-w-0"><OperatorsTable /></div>
        <div className="min-w-0"><EndKeywordsTable /></div>
      </div>
    </Card>
  )
}

/* -------------------------- Table helpers --------------------------- */

function BasicSyntaxTable() {
  const rules = [
    { python: "# comment", pseudocode: "// comment" },
    { python: "x = 5", pseudocode: "x ← 5" },
    { python: "print(x, y)", pseudocode: "OUTPUT x , y" },
    { python: "x = input()", pseudocode: "INPUT x" },
    { python: "A[0]", pseudocode: "A[0]  // arrays are 0-indexed" },
  ]

  return (
    <RuleTable title="Basic Syntax" rules={rules} />
  )
}

function ControlStructuresTable() {
  const rules = [
    { python: "if x == 0:", pseudocode: "IF x = 0 THEN" },
    { python: "elif x == 1:", pseudocode: "ELSE IF x = 1 THEN" },
    { python: "else:", pseudocode: "ELSE" },
    { python: "for i in range(1, 6):", pseudocode: "loop i from 1 to 5" },
    { python: "while x < 10:", pseudocode: "WHILE x < 10 DO" },
    { python: "def add(a, b):", pseudocode: "FUNCTION add(a , b)" },
    { python: "repeat ...", pseudocode: "loop … UNTIL condition" },
    { python: "match / case", pseudocode: "CASE OF … END CASE" },
  ]

  return (
    <RuleTable title="Control Structures" rules={rules} />
  )
}

function OperatorsTable() {
  const rules = [
    { python: "a // b", pseudocode: "a div b" },
    { python: "a % b", pseudocode: "a mod b" },
    { python: "and, or, not", pseudocode: "AND , OR , NOT" },
    { python: "== , !=", pseudocode: "= , ≠" },
    { python: "< , <= , > , >=", pseudocode: "< , ≤ , > , ≥" },
    { python: "+= , -= , *= , /=", pseudocode: "← x + … " },
  ]

  return (
    <RuleTable title="Operators" rules={rules} />
  )
}

function EndKeywordsTable() {
  const rules = [
    { python: "# end if", pseudocode: "END IF" },
    { python: "# end for", pseudocode: "end loop / END FOR" },
    { python: "# end while", pseudocode: "END WHILE" },
    { python: "# end function", pseudocode: "END FUNCTION" },
    { python: "# end case", pseudocode: "END CASE" },
    { python: "# end procedure", pseudocode: "END PROCEDURE" },
  ]

  return (
    <RuleTable title="Block Terminators" rules={rules} />
  )
}

/* ---------------------- Generic table component -------------------- */

interface Rule {
  python: string
  pseudocode: string
}
interface RuleTableProps {
  title: string
  rules: Rule[]
}

function RuleTable({ title, rules }: RuleTableProps) {
  return (
    <div className="overflow-x-auto">
      <h4 className="font-medium mb-2">{title}</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Python</th>
            <th className="text-left py-2">IB Pseudocode</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2 font-mono text-xs whitespace-pre">{rule.python}</td>
              <td className="py-2 font-mono text-xs whitespace-pre">{rule.pseudocode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
