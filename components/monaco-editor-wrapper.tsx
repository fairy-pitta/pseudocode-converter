"use client"

import { useEffect, useRef } from "react"

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
    // SSR では実行させない
    if (typeof window === "undefined" || !containerRef.current) return

    let disposed = false

    ;(async () => {
      /* 1) loader.js がすでにあるか確認して取得 -------------------------- */
      if (!document.getElementById("monaco-loader")) {
        const loaderScript = document.createElement("script")
        loaderScript.id = "monaco-loader"
        loaderScript.src =
          "https://unpkg.com/monaco-editor@latest/min/vs/loader.js"
        document.head.appendChild(loaderScript)
        await new Promise((res) => (loaderScript.onload = res))
      }

      /* 2) loader で Monaco を ESM import -------------------------------- */
      // @ts-ignore -- loader.js が global `require` を注入する
      window.require.config({
        paths: {
          vs: "https://unpkg.com/monaco-editor@latest/min/vs",
        },
      })

      const monaco: typeof import("monaco-editor") = await new Promise(
        (resolve) => {
          // @ts-ignore
          window.require(["vs/editor/editor.main"], () => {
            // @ts-ignore global monaco
            resolve(window.monaco as typeof import("monaco-editor"))
          })
        },
      )

      if (disposed || !containerRef.current) return

      /* 3) エディタ生成 -------------------------------------------------- */
      // 既存のエディタを破棄
      if (editorRef.current) {
        editorRef.current.dispose()
      }

      // コンテナをクリア
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
        onChange(editorRef.current!.getValue())
      })

      /* 5) クリーンアップ ----------------------------------------------- */
      return () => {
        disposed = true
        sub.dispose()
        editorRef.current?.dispose()
      }
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // ← 初回のみ

  /* ---------------------------------------------------------------------- */
  /* 外側 value 更新時: Monaco 側へ同期                                    */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.getValue() !== value) {
      editor.setValue(value)
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