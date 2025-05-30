import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Copy, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UnsupportedSyntaxPopupProps {
  isOpen: boolean
  onClose: () => void
  syntaxType: string
  originalCode: string
  lineNumber?: number
  suggestions?: string[]
}

const UnsupportedSyntaxPopup: React.FC<UnsupportedSyntaxPopupProps> = ({
  isOpen,
  onClose,
  syntaxType,
  originalCode,
  lineNumber,
  suggestions = []
}) => {
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(originalCode)
      toast({
        title: "Copied",
        description: "Code has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleReportIssue = () => {
    const issueUrl = `https://github.com/your-repo/issues/new?title=Unsupported%20Syntax:%20${encodeURIComponent(syntaxType)}&body=${encodeURIComponent(`Unsupported syntax detected:\n\n**Syntax Type:** ${syntaxType}\n**Line Number:** ${lineNumber || 'N/A'}\n**Code:**\n\`\`\`\n${originalCode}\n\`\`\``)}`
    window.open(issueUrl, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Unsupported Syntax Detected
          </DialogTitle>
          <DialogDescription>
            The following syntax is currently not supported. Please convert manually or report to the development team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Syntax Type:</h4>
            <code className="bg-muted px-2 py-1 rounded text-sm">{syntaxType}</code>
          </div>
          
          {lineNumber && (
            <div>
              <h4 className="text-sm font-medium mb-2">Line Number:</h4>
              <span className="text-sm text-muted-foreground">{lineNumber}</span>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-2">Original Code:</h4>
            <div className="relative">
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto max-h-32">
                <code>{originalCode}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopyCode}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleReportIssue} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UnsupportedSyntaxPopup