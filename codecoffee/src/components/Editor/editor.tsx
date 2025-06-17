"use client"

import { useRef, useState } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditorComponentProps {
  defaultLanguage?: string
  defaultValue?: string
  onChange?: (value: string | undefined) => void
  height?: string
}

const languageOptions = [
  { id: "javascript", name: "JavaScript", value: "javascript" },
  { id: "typescript", name: "TypeScript", value: "typescript" },
  { id: "python", name: "Python", value: "python" },
  { id: "java", name: "Java", value: "java" },
  { id: "cpp", name: "C++", value: "cpp" },
  { id: "go", name: "Go", value: "go" },
]

export function EditorComponent({
  defaultLanguage = "javascript",
  defaultValue = "// Write your code here\n",
  onChange,
  height = "70vh",
}: EditorComponentProps) {
  const [language, setLanguage] = useState(defaultLanguage)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const monacoRef = useRef<Monaco | null>(null)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    setIsEditorReady(true)

    // Set editor theme
    monaco.editor.defineTheme("codeDark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0f1117",
        "editor.foreground": "#f8f8f2",
        "editor.lineHighlightBackground": "#1e1e3f",
        "editor.selectionBackground": "#483c67",
        "editor.inactiveSelectionBackground": "#3a3a5e",
        "editorCursor.foreground": "#f8f8f0",
        "editorWhitespace.foreground": "#3b3a32",
        "editorIndentGuide.background": "#3b3a32",
        "editor.selectionHighlightBorder": "#222218",
      },
    })

    monaco.editor.setTheme("codeDark")
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">{isEditorReady ? "Editor ready" : "Loading editor..."}</div>
      </div>

      <div className="relative border rounded-md overflow-hidden">
        {!isEditorReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Editor
          height={height}
          language={language}
          value={defaultValue}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        />
      </div>
    </div>
  )
}
