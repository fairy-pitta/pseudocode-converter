'use client'
import { CambridgeConversionRules } from "@/components/cambridge-conversion-rules"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CambridgeRulesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Cambridge International Pseudocode Guide (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            This page outlines the official pseudocode conversion rules for Cambridge International AS &amp; A Level Computer Science (9618) 2026 examinations.<br />
            Refer to these guidelines when converting Python code to Cambridge standard pseudocode.<br />
            <a
              href="https://www.cambridgeinternational.org/Images/697401-2026-pseudocode-guide-for-teachers.pdf"
              className="underline text-blue-600 hover:text-blue-800 ml-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cambridge Pseudocode Official Guide PDF"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') window.open('https://www.cambridgeinternational.org/Images/697401-2026-pseudocode-guide-for-teachers.pdf', '_blank'); }}
            >
              Reference: Cambridge Official Pseudocode Guide (PDF)
            </a>
          </p>
          <div className="flex justify-center">
            <CambridgeConversionRules />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
