"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    monaco: typeof import("monaco-editor")
    require: {
      config: (options: { paths: { vs: string } }) => void
      (modules: string[], callback: () => void, errorCallback?: (error: any) => void): void
    }
  }
}

interface MonacoEditorWrapperProps {
  value: string
  onChange: (val: string) => void
  language?: string
  readOnly?: boolean
  height?: string
}

/**
 * MonacoEditorWrapper
 * -------------------
 * クライアント限定で Monaco Editor を動的ロードして表示する簡易ラッパー
 */
export function MonacoEditorWrapper({
  value,
  onChange,
  language = "python",
  readOnly = false,
  height = "400px",
}: MonacoEditorWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null)

  /* ---------------------------------------------------------------------- */
  /* 初回マウント時: Monaco をロードしてエディタを生成                      */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    let disposed = false

    ;(async () => {
      try {
        if (!document.getElementById("monaco-loader")) {
          const loaderScript = document.createElement("script")
          loaderScript.id = "monaco-loader"
          loaderScript.src =
            "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js"
          document.head.appendChild(loaderScript)
          
          await new Promise((resolve, reject) => {
            loaderScript.onload = resolve
            loaderScript.onerror = reject
          })
        }

        let retryCount = 0
        const maxRetries = 50
        
        while (!window.require && retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100))
          retryCount++
        }

        if (!window.require) {
          throw new Error("Monaco loader (window.require) is not available after waiting.")
        }

        window.require.config({
          paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs",
          },
        })

        const monaco: typeof import("monaco-editor") = await new Promise(
          (resolve, reject) => {
            window.require(["vs/editor/editor.main"], () => {
              if (window.monaco) {
                resolve(window.monaco)
              } else {
                reject(new Error("Monaco editor failed to load"))
              }
            }, reject)
          },
        )

        if (disposed || !containerRef.current) return

        if (editorRef.current) {
          editorRef.current.dispose()
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        editorRef.current = monaco.editor.create(containerRef.current, {
          value,
          language,
          readOnly,
          automaticLayout: true,
          theme: "vs",
          fontSize: 14,
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 4,
          insertSpaces: true,
        })

        /* 4) onChange へ通知 ---------------------------------------------- */
        const sub = editorRef.current.onDidChangeModelContent(() => {
          if (editorRef.current) {
            onChange(editorRef.current.getValue())
          }
        })

        /* 5) クリーンアップ ----------------------------------------------- */
        return () => {
          disposed = true
          sub.dispose()
          editorRef.current?.dispose()
        }
      } catch (error) {
        console.error("Monaco Editor initialization failed:", error)
        if (containerRef.current && !disposed) {
          containerRef.current.innerHTML = `
            <textarea 
              style="width: 100%; height: 100%; font-family: 'Courier New', monospace; font-size: 14px; padding: 10px; border: 1px solid #ccc; resize: none;"
              value="${value}"
              placeholder="Monaco Editor failed to load. Using fallback textarea."
            ></textarea>
          `
          const textarea = containerRef.current.querySelector('textarea')
          if (textarea) {
            textarea.addEventListener('input', (e) => {
              onChange((e.target as HTMLTextAreaElement).value)
            })
          }
        }
      }
    })()
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.getValue() !== value) {
      editor.setValue(value)
    } else if (!editor && containerRef.current) {
      const textarea = containerRef.current.querySelector('textarea')
      if (textarea && textarea.value !== value) {
        textarea.value = value
      }
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="monaco-editor-container"
    />
  )
}