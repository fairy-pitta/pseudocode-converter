"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { convertPythonToIB } from "python2ib"
// python2igcseはサーバーサイドでのみ使用するため、クライアントサイドではインポートしない
// import { Converter as PythonToIGCSEConverter } from "python2igcse"
import { JavaToIBConverter } from "java2ib"
import { DeepLStyleConverter } from "@/components/converter"

export default function PythonToPseudocodePage() {
  const [pythonCode, setPythonCode] = useState("")
  const [pseudocode, setPseudocode] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()
  const [pseudocodeStandard, setPseudocodeStandard] = useState<"ib" | "cambridge">("ib")
  const [sourceLanguage, setSourceLanguage] = useState<"python" | "java">("python") 

  // パーサーは直接関数として使用するか、クラスをインスタンス化して使用します
  const javaIBConverter = new JavaToIBConverter()
  // pythonIGConverterはサーバーサイドでのみ使用するため、クライアントサイドでは初期化しない

  const convertToPseudocode = useCallback(
    async (code?: string, opts?: { silent?: boolean }) => {
      const codeToConvert = code ?? pythonCode
      const silent = !!opts?.silent

      if (!codeToConvert.trim()) {
        if (!silent) {
          toast({
            title: "Error",
            description: "Please enter code to convert",
            variant: "destructive",
          })
        }
        return
      }

      if (!silent) setIsConverting(true)

      try {
        let converted = ''

        if (sourceLanguage === 'python') {
          if (pseudocodeStandard === 'ib') {
            try {
              const result: any = convertPythonToIB(codeToConvert)
              if (result && typeof result.then === 'function') {
                converted = await result
              } else {
                converted = result as string
              }
            } catch (err) {
              if (!silent) {
                console.error("Python to IB conversion error:", err)
                toast({
                  title: "Conversion Error",
                  description: "Invalid or incomplete Python code. Please check your syntax.",
                  variant: "destructive",
                })
              }
              return
            }
          } else {
            converted = "Python to IGCSE conversion requires server-side processing."
          }
        } else {
          // Java変換
          if (pseudocodeStandard === 'ib') {
            try {
              const res: any = javaIBConverter.convert(codeToConvert)
              if (res && typeof res.then === 'function') {
                const resolved: any = await res
                converted = resolved.pseudocode
              } else {
                converted = res.pseudocode
              }
            } catch (err) {
              if (!silent) {
                console.error("Java to IB conversion error:", err)
                toast({
                  title: "Conversion Error",
                  description: "Invalid or unsupported Java code. Please check your syntax.",
                  variant: "destructive",
                })
              }
              return
            }
          } else {
            converted = "Java to IGCSE conversion is coming soon!"
          }
        }

        setPseudocode(converted)
      } catch (error) {
        if (!silent) {
          console.error("Conversion error:", error)
          toast({
            title: "Conversion Error",
            description: "An unexpected error occurred while converting the code",
            variant: "destructive",
          })
        }
      } finally {
        if (!silent) setIsConverting(false)
      }
    },
    [pythonCode, pseudocodeStandard, sourceLanguage, toast],
  )

  // Auto-convert when code, language, or standard changes (debounced)
  useEffect(() => {
    const code = pythonCode;
    if (!code.trim()) {
      setPseudocode("");
      return;
    }
    const timer = setTimeout(() => {
      // Run conversion with current code and settings silently (no toasts/spinner)
      const p = convertToPseudocode(code, { silent: true });
      if (p && typeof (p as Promise<any>).then === 'function') {
        (p as Promise<any>).catch(() => {
          // swallow any auto-convert errors to avoid noisy overlays in dev
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [pythonCode, sourceLanguage, pseudocodeStandard, convertToPseudocode]);

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
