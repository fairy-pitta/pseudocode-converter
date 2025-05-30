import { IBConversionRules } from "@/components/ib-conversion-rules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IBRulesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">IB Computer Science Pseudocode Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            This page outlines the official pseudocode conversion rules for the IB Computer Science curriculum. Refer to
            these guidelines when converting Python code to IB standard pseudocode.
          </p>
          <IBConversionRules />
        </CardContent>
      </Card>
    </div>
  )
}
