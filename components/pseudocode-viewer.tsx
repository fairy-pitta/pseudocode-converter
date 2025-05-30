"use client"

import { MonacoPythonEditor } from "./monaco-editor"

interface PseudocodeViewerProps {
  value: string
  onCopy?: () => void
}

export function PseudocodeViewer({ value }: PseudocodeViewerProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <MonacoPythonEditor
        value={value}
        onChange={() => {}}
        readOnly={true}
        language="plaintext"
        height="400px"
      />
    </div>
  )
}
