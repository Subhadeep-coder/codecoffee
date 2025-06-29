'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Home, Check, X } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const sampleProblem = {
    title: "Two Sum",
    difficulty: "Easy",
    description: `
# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:

\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Example 3:

\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints:

- \`2 <= nums.length <= 104\`
- \`-109 <= nums[i] <= 109\`
- \`-109 <= target <= 109\`
- **Only one valid answer exists.**
  `,
    testCases: [
        {
            input: "nums = [2,7,11,15], target = 9",
            expected: "[0,1]",
            status: null
        },
        {
            input: "nums = [3,2,4], target = 6",
            expected: "[1,2]",
            status: null
        },
        {
            input: "nums = [3,3], target = 6",
            expected: "[0,1]",
            status: null
        }
    ]
}

const defaultCode = `function twoSum(nums, target) {
    // Write your solution here
    
}`

export default function SolvePage() {
    const [code, setCode] = useState(defaultCode)
    const [testResults, setTestResults] = useState(sampleProblem.testCases)
    const [isRunning, setIsRunning] = useState(false)

    const runTests = () => {
        setIsRunning(true)

        // Simulate test execution
        setTimeout(() => {
            const updatedResults = testResults.map((test, index) => ({
                ...test,
                status: index === 0 ? 'passed' : Math.random() > 0.5 ? 'passed' : 'failed'
            }))
            setTestResults(updatedResults as any)
            setIsRunning(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                        <h1 className="text-xl font-semibold">{sampleProblem.title}</h1>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${sampleProblem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                                sampleProblem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                    'bg-red-900 text-red-300'
                            }`}>
                            {sampleProblem.difficulty}
                        </span>
                    </div>
                    <Button onClick={runTests} disabled={isRunning}>
                        <Play className="h-4 w-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Tests'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
                {/* Problem Statement */}
                <div className="w-full lg:w-1/2 border-r border-border overflow-hidden">
                    <div className="h-full overflow-auto p-6">
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {sampleProblem.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Code Editor and Test Cases */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    {/* Code Editor */}
                    <div className="flex-1 min-h-[300px] lg:min-h-0">
                        <div className="h-full border-b border-border">
                            <MonacoEditor
                                height="100%"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>

                    {/* Test Cases */}
                    <div className="h-64 lg:h-80 overflow-hidden">
                        <Tabs defaultValue="testcases" className="h-full flex flex-col">
                            <TabsList className="w-full justify-start rounded-none border-b">
                                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                                <TabsTrigger value="output">Output</TabsTrigger>
                            </TabsList>

                            <TabsContent value="testcases" className="flex-1 overflow-auto p-4 mt-0">
                                <div className="space-y-3">
                                    {testResults.map((test, index) => (
                                        <Card key={index} className="border">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-sm font-medium">Test Case {index + 1}</span>
                                                    {test.status && (
                                                        <div className={`flex items-center gap-1 text-xs ${test.status === 'passed' ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {test.status === 'passed' ?
                                                                <Check className="h-3 w-3" /> :
                                                                <X className="h-3 w-3" />
                                                            }
                                                            {test.status}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Input: </span>
                                                        <code className="bg-muted px-1 rounded">{test.input}</code>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Expected: </span>
                                                        <code className="bg-muted px-1 rounded">{test.expected}</code>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="output" className="flex-1 overflow-auto p-4 mt-0">
                                <div className="text-sm text-muted-foreground">
                                    {isRunning ? (
                                        <div>Running tests...</div>
                                    ) : (
                                        <div>Click "Run Tests" to see output</div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}