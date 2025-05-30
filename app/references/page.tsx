import { ReferenceSection } from "@/components/reference-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReferencesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Official References & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Find official documentation and helpful resources related to IB and Cambridge Computer Science pseudocode
            standards.
          </p>
          <ReferenceSection />
        </CardContent>
      </Card>
    </div>
  )
}
