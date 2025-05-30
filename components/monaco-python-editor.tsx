"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"
import type { editor } from "monaco-editor"

interface MonacoPythonEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
  language?: string
}

export function MonacoPythonEditor({
  value,
  onChange,
  height = "100%",
  readOnly = false,
  language = "python",
}: MonacoPythonEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        renderLineHighlight: "all",
        theme: "vs",
      }}
    />
  )
}
