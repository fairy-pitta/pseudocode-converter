"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowRight, ChevronDown, Code, FileText, RotateCcwIcon as RotateCcw2 } from "lucide-react"

interface LanguageSelectorProps {
  pseudocodeStandard: "ib" | "cambridge"
  onStandardChange: (standard: "ib" | "cambridge") => void
  onConvert: () => void
  onClear: () => void
  isConverting: boolean
  autoConvert: boolean
}

export function LanguageSelector({
  pseudocodeStandard,
  onStandardChange,
  onConvert,
  onClear,
  isConverting,
}: LanguageSelectorProps) {
  const [isSwapping, setIsSwapping] = useState(false)

  const handleSwap = () => {
    setIsSwapping(true)
    setTimeout(() => {
      onStandardChange(pseudocodeStandard === "ib" ? "cambridge" : "ib")
      setIsSwapping(false)
    }, 150)
  }

  const getStandardInfo = (standard: "ib" | "cambridge") => {
    switch (standard) {
      case "ib":
        return {
          name: "IB Pseudocode",
          description: "IB Computer Science Standard",
          flag: "🎓",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "cambridge":
        return {
          name: "Cambridge Pseudocode",
          description: "IGCSE/AS & A Level (2026)",
          flag: "🏛️",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        }
    }
  }

  const currentStandard = getStandardInfo(pseudocodeStandard)

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-center gap-4">
        {/* Source Language */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
            <Code className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Python</div>
              <div className="text-xs text-gray-500">Source Code</div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwap}
          className={`p-2 transition-transform duration-150 ${isSwapping ? "rotate-180" : ""}`}
          disabled={isSwapping}
        >
          <RotateCcw2 className="w-4 h-4" />
        </Button>

        {/* Target Language Dropdown */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-2 px-4 py-3 h-auto justify-start ${currentStandard.bgColor} ${currentStandard.borderColor}`}
              >
                <FileText className={`w-5 h-5 ${currentStandard.color}`} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 flex items-center gap-1">
                    <span>{currentStandard.flag}</span>
                    {currentStandard.name}
                  </div>
                  <div className="text-xs text-gray-500">{currentStandard.description}</div>
                </div>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[250px]">
              <DropdownMenuItem
                onClick={() => onStandardChange("ib")}
                className={pseudocodeStandard === "ib" ? "bg-blue-50" : ""}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg">🎓</span>
                  <div>
                    <div className="font-medium">IB Pseudocode</div>
                    <div className="text-xs text-gray-500">IB Computer Science Standard</div>
                  </div>
                  {pseudocodeStandard === "ib" && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStandardChange("cambridge")}
                className={pseudocodeStandard === "cambridge" ? "bg-purple-50" : ""}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-lg">🏛️</span>
                  <div>
                    <div className="font-medium">Cambridge Pseudocode</div>
                    <div className="text-xs text-gray-500">IGCSE/AS & A Level (2026)</div>
                  </div>
                  {pseudocodeStandard === "cambridge" && <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full" />}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <Button onClick={onConvert} disabled={isConverting} size="sm" className="bg-blue-600 hover:bg-blue-700">
            {isConverting ? (
              "Converting..."
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Convert
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClear} size="sm">
            <RotateCcw2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          {pseudocodeStandard === "ib"
            ? "Converting to IB Computer Science pseudocode format • div/mod operators • loop syntax"
            : "Converting to Cambridge International pseudocode format • DIV/MOD operators • NEXT/ENDIF syntax"}
        </div>
      </div>
    </Card>
  )
}
