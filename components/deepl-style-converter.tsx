"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronDown,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  X,
  Code2,
} from "lucide-react"
import { MonacoEditorWrapper } from "./monaco-editor-wrapper"
import { useToast } from "@/hooks/use-toast"

interface DeepLStyleConverterProps {
  pythonCode: string
  pseudocode: string
  pseudocodeStandard: "ib" | "cambridge"
  isConverting: boolean
  onCodeChange: (code: string) => void
  onStandardChange: (standard: "ib" | "cambridge") => void
  onConvert: () => void
  onClear: () => void
}

export function DeepLStyleConverter({
  pythonCode,
  pseudocode,
  pseudocodeStandard,
  isConverting,
  onCodeChange,
  onStandardChange,
  onConvert,
  onClear,
}: DeepLStyleConverterProps) {
  const { toast } = useToast()

  /* ------------------------- language label helpers ------------------------- */
  const sourceLanguage = {
    name: "Python",
    icon: <Code2 className="w-5 h-5" />,
    description: "Source Code",
  }

  const targetLanguage =
    pseudocodeStandard === "ib"
      ? { name: "IB Pseudocode", icon: "🎓", description: "IB Computer Science" }
      : {
          name: "Cambridge Pseudocode",
          icon: "🏛️",
          description: "IGCSE / AS & A-Level",
        }

  /* ---------------------------- util functions ------------------------------ */
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast({ title: "Copied", description: "Code copied to clipboard" })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive",
      })
    }
  }

  /* -------------------------------------------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border">
      {/* top bar ------------------------------------------------------------- */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <Button
          onClick={onConvert}
          disabled={isConverting || !pythonCode.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isConverting ? "Converting…" : "Convert"}
        </Button>
      </div>

      {/* editor panes -------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* left (source) pane ------------------------------------------------ */}
        <div className="relative border rounded-lg overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-center gap-2 p-3 border-b bg-gray-50">
            {sourceLanguage.icon}
            <div>
              <div className="font-medium text-sm">{sourceLanguage.name}</div>
              <div className="text-xs text-gray-500">
                {sourceLanguage.description}
              </div>
            </div>
          </div>

          {/* monaco editor */}
          <div className="flex-1 min-h-[400px]">
            <MonacoEditorWrapper
              value={pythonCode}
              onChange={onCodeChange}
              language="python"
              height="100%"
            />
          </div>

          {/* action bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2 bg-white/80 backdrop-blur-sm rounded px-2 py-1">
            {pythonCode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCodeChange("")}
                className="p-2 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="p-2 h-8 w-8"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* right (target) pane ---------------------------------------------- */}
        <div className="relative border rounded-lg overflow-hidden flex flex-col">
          {/* header with dropdown */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0 h-auto hover:bg-gray-100 rounded-md px-2 py-1"
                >
                  <span className="text-lg">{targetLanguage.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {targetLanguage.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {targetLanguage.description}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[230px] shadow-lg border">
                {/* IB */}
                <DropdownMenuItem
                  onClick={() => onStandardChange("ib")}
                  className={`flex items-center gap-2 w-full p-2 text-sm rounded-md ${
                    pseudocodeStandard === "ib"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">🎓</span>
                  <div className="flex-1">
                    <div className="font-medium">IB Pseudocode</div>
                    <div className="text-xs text-gray-500">
                      IB Computer Science
                    </div>
                  </div>
                </DropdownMenuItem>

                {/* Cambridge */}
                <DropdownMenuItem
                  onClick={() => onStandardChange("cambridge")}
                  className={`flex items-center gap-2 w-full p-2 text-sm rounded-md ${
                    pseudocodeStandard === "cambridge"
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">🏛️</span>
                  <div className="flex-1">
                    <div className="font-medium">Cambridge Pseudocode</div>
                    <div className="text-xs text-gray-500">
                      IGCSE / AS & A-Level
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* result textarea */}
          <div className="flex-1 min-h-[400px]">
            <Textarea
              readOnly
              value={pseudocode}
              placeholder={`Converted ${
                pseudocodeStandard === "ib" ? "IB" : "Cambridge"
              } pseudocode will appear here…`}
              className="h-full border-0 rounded-none resize-none bg-gray-50 font-mono text-sm"
            />
          </div>

          {/* action bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2">
            {pseudocode && (
              <>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <ThumbsDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(pseudocode)}
                  className="p-2 h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <Share2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}