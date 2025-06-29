"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RotateCcw } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface CodeEditorProps {
    problemId: string
}

export function CodeEditor({ problemId }: CodeEditorProps) {
    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`)
    const [isRunning, setIsRunning] = useState(false)
    const [output, setOutput] = useState("")

    const languages = [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "cpp", label: "C++" },
    ]

    const getDefaultCode = (lang: string) => {
        switch (lang) {
            case "python":
                return `def twoSum(nums, target):
    # Write your solution here
    pass`
            case "java":
                return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`
            case "cpp":
                return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`
            default:
                return `function twoSum(nums, target) {
    // Write your solution here
    
}`
        }
    }

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage)
        setCode(getDefaultCode(newLanguage))
    }

    const handleRun = async () => {
        setIsRunning(true)
        // Simulate code execution
        setTimeout(() => {
            setOutput(`Test Case 1: Passed
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Expected: [0,1]

Test Case 2: Passed
Input: nums = [3,2,4], target = 6
Output: [1,2]
Expected: [1,2]

Runtime: 64 ms
Memory: 15.2 MB`)
            setIsRunning(false)
        }, 2000)
    }

    const handleReset = () => {
        setCode(getDefaultCode(language))
        setOutput("")
    }

    return (
        <div className="flex flex-col h-full">
            {/* Editor Header */}
            <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                        <Button size="sm" onClick={handleRun} disabled={isRunning}>
                            <Play className="h-4 w-4 mr-1" />
                            {isRunning ? "Running..." : "Run Code"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
                <MonacoEditor
                    height="60%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            {/* Output Panel */}
            {output && (
                <div className="border-t border-border bg-muted/30 p-4 max-h-40 overflow-auto">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Output:</h3>
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{output}</pre>
                </div>
            )}
        </div>
    )
}
