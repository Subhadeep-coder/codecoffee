import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Copy, Check } from "lucide-react";

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  theme?: "vs-dark" | "vs-light";
  className?: string;
}

// Language mappings for Monaco Editor
const LANGUAGE_MAPPINGS: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  C: "c",
  "C#": "csharp",
  Go: "go",
  Rust: "rust",
  PHP: "php",
  Ruby: "ruby",
  Swift: "swift",
  Kotlin: "kotlin",
  SQL: "sql",
  HTML: "html",
  CSS: "css",
  JSON: "json",
  XML: "xml",
  YAML: "yaml",
  Markdown: "markdown",
  Shell: "shell",
  PowerShell: "powershell",
};

export function MonacoCodeEditor({
  value,
  onChange,
  language,
  placeholder = "// Start coding here...",
  height = 300,
  readOnly = false,
  theme = "vs-dark",
  className = "",
}: MonacoCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [monaco, setMonaco] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Monaco Editor
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
    script.onload = () => {
      (window as any).require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
        },
      });

      (window as any).require(["vs/editor/editor.main"], (monaco: any) => {
        setMonaco(monaco);
        initializeEditor(monaco);
      });
    };
    document.head.appendChild(script);

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monaco && editorRef.current) {
      const monacoLanguage =
        LANGUAGE_MAPPINGS[language] || language.toLowerCase();
      monaco.editor.setModelLanguage(
        editorRef.current.getModel(),
        monacoLanguage,
      );
    }
  }, [language, monaco]);

  const initializeEditor = (monacoInstance: any) => {
    if (containerRef.current) {
      const monacoLanguage =
        LANGUAGE_MAPPINGS[language] || language.toLowerCase();

      editorRef.current = monacoInstance.editor.create(containerRef.current, {
        value: value || placeholder,
        language: monacoLanguage,
        theme: theme,
        readOnly: readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        automaticLayout: true,
        wordWrap: "on",
        contextmenu: true,
        selectOnLineNumbers: true,
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderLineHighlight: "line",
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        acceptSuggestionOnCommitCharacter: true,
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        parameterHints: {
          enabled: true,
        },
        wordBasedSuggestions: true,
        suggest: {
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showStructs: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showKeywords: true,
          showText: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showSnippets: true,
        },
      });

      // Handle content changes
      editorRef.current.onDidChangeModelContent(() => {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== value) {
          onChange(currentValue);
        }
      });

      // Add custom snippets for common coding patterns
      addCustomSnippets(monacoInstance, monacoLanguage);
    }
  };

  const addCustomSnippets = (monacoInstance: any, language: string) => {
    // Add common snippets based on language
    const snippets: any[] = [];

    if (language === "javascript" || language === "typescript") {
      snippets.push(
        {
          label: "for-loop",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText:
            "for (let i = 0; i < ${1:array}.length; i++) {\n\t${2:// code}\n}",
          insertTextRules:
            monacoInstance.languages.CompletionItemInsertTextRule
              .InsertAsSnippet,
        },
        {
          label: "function",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText:
            "function ${1:name}(${2:params}) {\n\t${3:// code}\n\treturn ${4:result};\n}",
          insertTextRules:
            monacoInstance.languages.CompletionItemInsertTextRule
              .InsertAsSnippet,
        },
      );
    }

    if (language === "python") {
      snippets.push(
        {
          label: "for-loop",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText: "for ${1:item} in ${2:iterable}:\n\t${3:# code}",
          insertTextRules:
            monacoInstance.languages.CompletionItemInsertTextRule
              .InsertAsSnippet,
        },
        {
          label: "function",
          kind: monacoInstance.languages.CompletionItemKind.Snippet,
          insertText:
            "def ${1:name}(${2:params}):\n\t${3:# code}\n\treturn ${4:result}",
          insertTextRules:
            monacoInstance.languages.CompletionItemInsertTextRule
              .InsertAsSnippet,
        },
      );
    }

    if (snippets.length > 0) {
      monacoInstance.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: () => {
          return { suggestions: snippets };
        },
      });
    }
  };

  const handleCopy = async () => {
    if (editorRef.current) {
      const text = editorRef.current.getValue();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getDefaultTemplate = (lang: string) => "";

  const handleUseTemplate = () => {
    const template = getDefaultTemplate(language);
    if (editorRef.current) {
      editorRef.current.setValue(template);
    }
  };

  return (
    <Card className={`relative ${className}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language} Editor
          </span>
          {!value && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleUseTemplate}
              className="text-xs"
            >
              Use Template
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExpand}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          height: isExpanded ? "60vh" : `${height}px`,
          width: "100%",
          transition: "height 0.3s ease",
        }}
        className="border-0"
      />
    </Card>
  );
}
