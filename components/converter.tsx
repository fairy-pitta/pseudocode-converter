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
  X,
  Code2,
  Check, 
} from "lucide-react"
import { MonacoEditorWrapper } from "./monaco-editor-wrapper"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react';
import UnsupportedSyntaxPopup from './unsupported-syntax-popup';
import { Java2IB } from '@/lib/java-to-pseudocode-parser-ib';
import { Java2IG } from '@/lib/java-to-pseudocode-parser-igsce';

interface DeepLStyleConverterProps {
  sourceCode: string
  pseudocode: string
  sourceLanguage: "python" | "java"
  pseudocodeStandard: "ib" | "cambridge"
  isConverting: boolean
  onCodeChange: (code: string) => void
  onLanguageChange: (language: "python" | "java") => void
  onStandardChange: (standard: "ib" | "cambridge") => void
  onConvert: () => void
  onClear: () => void
}

export function DeepLStyleConverter({
  sourceCode,
  pseudocode,
  sourceLanguage,
  pseudocodeStandard,
  isConverting,
  onCodeChange,
  onLanguageChange,
  onStandardChange,
  onConvert,
  onClear,
}: DeepLStyleConverterProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false) // 追加

  /* ------------------------- language label helpers ------------------------- */
  const getSourceLanguageInfo = () => {
    if (sourceLanguage === "python") {
      return {
        name: "Python",
        icon: <Code2 className="w-5 h-5" />,
        description: "Source Code",
      }
    } else {
      return {
        name: "Java",
        icon: "☕",
        description: "Source Code",
      }
    }
  }

  const sourceLanguageInfo = getSourceLanguageInfo()

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
      setIsCopied(true)
      toast({ title: "Copied", description: "Code copied to clipboard" })
      // 2秒後にアイコンを元に戻す
      setTimeout(() => setIsCopied(false), 2000)
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
          disabled={isConverting || !sourceCode.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isConverting ? "Converting…" : "Convert"}
        </Button>
      </div>

      {/* editor panes -------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* left (source) pane ------------------------------------------------ */}
        <div className="relative border rounded-lg overflow-hidden flex flex-col">
          {/* header with language dropdown */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0 h-auto hover:bg-gray-100 rounded-md px-2 py-1"
                >
                  {typeof sourceLanguageInfo.icon === "string" ? (
                    <span className="text-lg">{sourceLanguageInfo.icon}</span>
                  ) : (
                    sourceLanguageInfo.icon
                  )}
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {sourceLanguageInfo.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sourceLanguageInfo.description}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] shadow-lg border">
                {/* Python */}
                <DropdownMenuItem
                  onClick={() => onLanguageChange("python")}
                  className={`flex items-center gap-2 w-full p-2 text-sm rounded-md ${
                    sourceLanguage === "python"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Code2 className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">Python</div>
                    <div className="text-xs text-gray-500">Source Code</div>
                  </div>
                </DropdownMenuItem>

                {/* Java */}
                <DropdownMenuItem
                  onClick={() => onLanguageChange("java")}
                  className={`flex items-center gap-2 w-full p-2 text-sm rounded-md ${
                    sourceLanguage === "java"
                      ? "bg-orange-50 text-orange-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">☕</span>
                  <div className="flex-1">
                    <div className="font-medium">Java</div>
                    <div className="text-xs text-gray-500">Source Code</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* monaco editor */}
          <div className="flex-1 min-h-[400px]">
            <MonacoEditorWrapper
              value={sourceCode}
              onChange={onCodeChange}
              language={sourceLanguage}
              height="100%"
            />
          </div>

          {/* action bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2 bg-white/80 backdrop-blur-sm rounded px-2 py-1">
            {sourceCode && (
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(pseudocode)}
                  className="p-2 h-8 w-8"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Converter = () => {
  const [showUnsupportedPopup, setShowUnsupportedPopup] = useState(false);
  const [unsupportedSyntax, setUnsupportedSyntax] = useState<{
    type: string;
    code: string;
    line?: number;
  } | null>(null);

  const handleUnsupportedSyntax = (syntaxType: string, originalCode: string, lineNumber?: number) => {
    setUnsupportedSyntax({
      type: syntaxType,
      code: originalCode,
      line: lineNumber
    });
    setShowUnsupportedPopup(true);
  };

  const convertCode = (sourceCode: string, parserType: 'ib' | 'igsce') => {
    const options = { onUnsupportedSyntax: handleUnsupportedSyntax };
    
    if (parserType === 'ib') {
      const parser = new Java2IB();
      return parser.parse(sourceCode);
    } else {
      const parser = new Java2IG(options);
      return parser.parse(sourceCode);
    }
  };

  return (
    <div>
      {/* Your existing converter UI */}
      
      <UnsupportedSyntaxPopup
        isOpen={showUnsupportedPopup}
        onClose={() => setShowUnsupportedPopup(false)}
        syntaxType={unsupportedSyntax?.type || ''}
        originalCode={unsupportedSyntax?.code || ''}
        lineNumber={unsupportedSyntax?.line}
        suggestions={[
          "Please convert this syntax manually to pseudocode",
          "Try using a similar supported syntax pattern",
          "Check the documentation for supported syntax"
        ]}
      />
    </div>
  );
};

export default Converter;