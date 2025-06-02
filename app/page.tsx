"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { IBParser } from "@/lib/python-to-pseudocode-parser-ib"
import { IGCSEPseudocodeParser } from "@/lib/python-to-pseudocode-parser-igcse"
import { DeepLStyleConverter } from "@/components/converter"

export default function PythonToPseudocodePage() {
  const [pythonCode, setPythonCode] = useState("")
  const [pseudocode, setPseudocode] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()
  const [pseudocodeStandard, setPseudocodeStandard] = useState<"ib" | "cambridge">("ib")
  const [sourceLanguage, setSourceLanguage] = useState<"python" | "java">("python") 

  const ibParser = new IBParser()
  const cambridgeParser = new IGCSEPseudocodeParser()
  const parser = pseudocodeStandard === "ib" ? ibParser : cambridgeParser

  const convertToPseudocode = useCallback(
    async (code?: string) => {
      const codeToConvert = code || pythonCode

      if (!codeToConvert.trim()) {
        toast({
          title: "Error",
          description: "Please enter Python code to convert",
          variant: "destructive",
        })
        return
      }

      setIsConverting(true)

      try {
        setTimeout(() => {
          const converted = parser.parse(codeToConvert)
          setPseudocode(converted)
          setIsConverting(false)
        }, 300)
      } catch (error) {
        console.error("Conversion error:", error)
        toast({
          title: "Conversion Error",
          description: "An error occurred while converting the code",
          variant: "destructive",
        })
        setIsConverting(false)
      }
    },
    [pythonCode, parser, toast],
  )

  const handleCodeChange = useCallback((value: string) => {
    setPythonCode(value)
  }, [])

  const clearAll = () => {
    setPythonCode("")
    setPseudocode("")
  }

  const handleStandardChange = (standard: "ib" | "cambridge") => {
    setPseudocodeStandard(standard)
    if (pythonCode.trim()) {
      setPseudocode("")
    }
  }

  const handleLanguageChange = (language: "python" | "java") => { 
    setSourceLanguage(language)
    if (pythonCode.trim()) {
      setPseudocode("")
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center my-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pseudocode Converter</h1>
      </header>

      {/* Main Converter */}
      <div className="mb-8">
        <DeepLStyleConverter
          sourceCode={pythonCode} 
          pseudocode={pseudocode}
          sourceLanguage={sourceLanguage} 
          pseudocodeStandard={pseudocodeStandard}
          isConverting={isConverting}
          onCodeChange={handleCodeChange}
          onLanguageChange={handleLanguageChange} 
          onStandardChange={handleStandardChange}
          onConvert={() => convertToPseudocode()}
          onClear={clearAll}
        />
        
        {/* Description for target audience */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto italic">
            This tool is designed for students and teachers who are comfortable writing code 
            but may be unfamiliar with pseudocode conventions. Convert your Python or Java code 
            into standardized pseudocode format for academic assignments and examinations.
          </p>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto mt-2 italic">
            If you encounter any bugs or unsupported code patterns, please report them via GitHub issues 
            from my contact page, or reach out through my portfolio if you don't have a GitHub account. 
            I'll address issues as quickly as possible.
          </p>
        </div>
      </div>

    </div>
  )
}
