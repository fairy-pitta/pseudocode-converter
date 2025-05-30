'use client'
import { IBConversionRules } from "@/components/ib-conversion-rules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IBRulesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">IB Computer Science Pseudocode Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            This page outlines the official pseudocode conversion rules for the IB Computer Science curriculum.<br />
            Refer to these guidelines when converting Python code to IB standard pseudocode.<br />
            <a
              href="https://computersciencewiki.org/images/c/c6/IB-Pseudocode-rules.pdf"
              className="underline text-blue-600 hover:text-blue-800 ml-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IB Pseudocode Official Rules PDF"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') window.open('https://computersciencewiki.org/images/c/c6/IB-Pseudocode-rules.pdf', '_blank'); }}
            >
              Reference: IB Official Pseudocode Rules (PDF)
            </a>
          </p>
          <div className="flex justify-center">
            <IBConversionRules />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
