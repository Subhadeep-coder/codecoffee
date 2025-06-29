'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Home, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CreatePage() {
    const [problem, setProblem] = useState({
        title: '',
        difficulty: 'Easy',
        description: '',
        testCases: [{ input: '', expected: '' }]
    })

    const [previewMode, setPreviewMode] = useState(false)

    const addTestCase = () => {
        setProblem(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: '', expected: '' }]
        }))
    }

    const removeTestCase = (index: number) => {
        setProblem(prev => ({
            ...prev,
            testCases: prev.testCases.filter((_, i) => i !== index)
        }))
    }

    const updateTestCase = (index: number, field: string, value: string) => {
        setProblem(prev => ({
            ...prev,
            testCases: prev.testCases.map((tc, i) =>
                i === index ? { ...tc, [field]: value } : tc
            )
        }))
    }

    const handleSave = () => {
        // Here you would typically save to a database
        console.log('Saving problem:', problem)
        alert('Problem saved successfully!')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/60">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border p-4 shadow-sm">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="hover:bg-accent">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight">Create Problem</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={previewMode ? 'default' : 'outline'}
                            onClick={() => setPreviewMode(!previewMode)}
                            className="transition-colors"
                        >
                            {previewMode ? 'Edit' : 'Preview'}
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                            <Save className="h-4 w-4 mr-2" />
                            Save Problem
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="space-y-8">
                            <Card className="shadow-md border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Problem Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label htmlFor="title" className="font-medium">Title</Label>
                                        <Input
                                            id="title"
                                            value={problem.title}
                                            onChange={(e) => setProblem(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter problem title"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="difficulty" className="font-medium">Difficulty</Label>
                                        <select
                                            id="difficulty"
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem(prev => ({ ...prev, difficulty: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="font-medium">Description (Markdown)</Label>
                                        <Textarea
                                            id="description"
                                            value={problem.description}
                                            onChange={(e) => setProblem(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter problem description in Markdown format..."
                                            className="min-h-[200px] font-mono mt-1"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md border-border/60">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-lg font-semibold">
                                        Test Cases
                                        <Button size="sm" onClick={addTestCase} className="ml-2 bg-accent hover:bg-accent/80">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {problem.testCases.map((testCase, index) => (
                                        <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/40 relative group transition-shadow hover:shadow-lg">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-medium">Test Case {index + 1}</Label>
                                                {problem.testCases.length > 1 && (
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeTestCase(index)}
                                                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                                                        aria-label="Remove test case"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor={`input-${index}`} className="font-medium">Input</Label>
                                                <Textarea
                                                    id={`input-${index}`}
                                                    value={testCase.input}
                                                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                                    placeholder="Enter test input..."
                                                    className="font-mono mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor={`expected-${index}`} className="font-medium">Expected Output</Label>
                                                <Textarea
                                                    id={`expected-${index}`}
                                                    value={testCase.expected}
                                                    onChange={(e) => updateTestCase(index, 'expected', e.target.value)}
                                                    placeholder="Enter expected output..."
                                                    className="font-mono mt-1"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="space-y-8">
                            <Card className="shadow-lg border-primary/30">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {previewMode ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-bold tracking-tight">{problem.title || 'Untitled Problem'}</h2>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${problem.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                                                        'bg-red-900 text-red-200'
                                                    }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </div>

                                            <div className="prose prose-invert max-w-none bg-background/80 rounded-lg p-4 border border-border/60">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {problem.description || '*No description provided*'}
                                                </ReactMarkdown>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">Test Cases</h3>
                                                {problem.testCases.map((testCase, index) => (
                                                    <Card key={index} className="border bg-muted/60">
                                                        <CardContent className="p-4">
                                                            <div className="space-y-2">
                                                                <div className="font-medium">Test Case {index + 1}</div>
                                                                <div className="space-y-1 text-sm">
                                                                    <div>
                                                                        <span className="text-muted-foreground">Input: </span>
                                                                        <code className="bg-muted px-1 rounded">
                                                                            {testCase.input || 'No input provided'}
                                                                        </code>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-muted-foreground">Expected: </span>
                                                                        <code className="bg-muted px-1 rounded">
                                                                            {testCase.expected || 'No expected output provided'}
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-12">
                                            <p className="text-lg font-medium">Fill in the form details to see the preview</p>
                                            <p className="text-sm mt-2">Click "Preview" to see how your problem will look</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
