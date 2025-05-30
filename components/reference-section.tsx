'use client'
import { Card } from "@/components/ui/card"
import { ExternalLink, BookOpen, FileText } from "lucide-react"

export function ReferenceSection() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 justify-center text-center">
        <BookOpen className="w-6 h-6" />
        Official References
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col h-full p-4 border rounded-lg bg-blue-50 border-blue-200 min-w-0 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">IB Pseudocode Rules (Official)</h4>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Official IB Computer Science pseudocode notation rules and standards.
            </p>
          </div>
          <a
            href="https://computersciencewiki.org/images/c/c6/IB-Pseudocode-rules.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors text-sm font-medium justify-center"
            aria-label="IB Pseudocode Rules PDF"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') (e.currentTarget as HTMLAnchorElement).click(); }}
          >
            View PDF Document
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-col h-full p-4 border rounded-lg bg-purple-50 border-purple-200 min-w-0 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-purple-900">Cambridge Pseudocode Guide (2026)</h4>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Cambridge International AS & A Level Computer Science pseudocode guide for 2026 exams.
            </p>
          </div>
          <a
            href="https://www.cambridgeinternational.org/Images/697401-2026-pseudocode-guide-for-teachers.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-colors text-sm font-medium justify-center"
            aria-label="Cambridge Pseudocode Guide PDF"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') (e.currentTarget as HTMLAnchorElement).click(); }}
          >
            View PDF Document
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  )
}
