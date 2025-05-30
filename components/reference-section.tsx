import { Card } from "@/components/ui/card"
import { ExternalLink, BookOpen, FileText } from "lucide-react"

export function ReferenceSection() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Official References
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">IB Pseudocode Rules (Official)</h4>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Official IB Computer Science pseudocode notation rules and standards.
          </p>
          <a
            href="https://computersciencewiki.org/images/c/c6/IB-Pseudocode-rules.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View PDF Document
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-purple-900">Cambridge Pseudocode Guide (2026)</h4>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Cambridge International AS & A Level Computer Science pseudocode guide for 2026 exams.
          </p>
          <a
            href="https://www.cambridgeinternational.org/Images/697401-2026-pseudocode-guide-for-teachers.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 underline"
          >
            View PDF Document
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <h4 className="font-medium text-green-900">Computer Science Wiki</h4>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Comprehensive resource for IB Computer Science curriculum and materials.
          </p>
          <a
            href="https://computersciencewiki.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 underline"
          >
            Visit Website
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  )
}
