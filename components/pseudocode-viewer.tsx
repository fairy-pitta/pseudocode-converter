"use client"

import { MonacoPythonEditor } from "./monaco-python-editor"

interface PseudocodeViewerProps {
  value: string
  onCopy?: () => void
}

export function PseudocodeViewer({ value }: PseudocodeViewerProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <MonacoPythonEditor
        value={value}
        onChange={() => {}} // 読み取り専用なので何もしない
        readOnly={true}
        language="plaintext"
        height="400px"
      />
    </div>
  )
}
