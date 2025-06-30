'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Home, Plus, Trash2, Save, X } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api } from '@/lib/axios'

const toast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`)
    alert(`${type.toUpperCase()}: ${message}`)
}

interface TestCaseDto {
    input: string
    expectedOutput: string
    isHidden: boolean
    explanation?: string
}

interface CreateProblemsDto {
    title: string
    description: string
    difficulty: string
    tags: string[]
    constraints: string
    hints: string[]
    companies: string[]
    testCases: TestCaseDto[]
    isPremium?: boolean
}

export default function CreatePage() {
    const [problem, setProblem] = useState<CreateProblemsDto>({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: [],
        constraints: '',
        hints: [],
        companies: [],
        testCases: [{ input: '', expectedOutput: '', isHidden: false, explanation: '' }],
        isPremium: false
    })

    const [previewMode, setPreviewMode] = useState(false)
    const [loading, setLoading] = useState(false)

    const [tagInput, setTagInput] = useState('')
    const [hintInput, setHintInput] = useState('')
    const [companyInput, setCompanyInput] = useState('')

    const addTestCase = () => {
        setProblem(prev => ({
            ...prev,
            testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false, explanation: '' }]
        }))
    }

    const removeTestCase = (index: number) => {
        setProblem(prev => ({
            ...prev,
            testCases: prev.testCases.filter((_, i) => i !== index)
        }))
    }

    const updateTestCase = (index: number, field: keyof TestCaseDto, value: string | boolean) => {
        setProblem(prev => ({
            ...prev,
            testCases: prev.testCases.map((tc, i) =>
                i === index ? { ...tc, [field]: value } : tc
            )
        }))
    }

    const addTag = () => {
        if (tagInput.trim() && !problem.tags.includes(tagInput.trim())) {
            setProblem(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }))
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setProblem(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const addHint = () => {
        if (hintInput.trim()) {
            setProblem(prev => ({
                ...prev,
                hints: [...prev.hints, hintInput.trim()]
            }))
            setHintInput('')
        }
    }

    const removeHint = (index: number) => {
        setProblem(prev => ({
            ...prev,
            hints: prev.hints.filter((_, i) => i !== index)
        }))
    }

    const addCompany = () => {
        if (companyInput.trim() && !problem.companies.includes(companyInput.trim())) {
            setProblem(prev => ({
                ...prev,
                companies: [...prev.companies, companyInput.trim()]
            }))
            setCompanyInput('')
        }
    }

    const removeCompany = (companyToRemove: string) => {
        setProblem(prev => ({
            ...prev,
            companies: prev.companies.filter(company => company !== companyToRemove)
        }))
    }

    const formatTestCaseText = (text: string) => {
        if (!text) return 'No data provided'

        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length === 0) return 'No data provided'

        return lines.map((line, index) => (
            <div key={index} className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mb-1">
                {line}
            </div>
        ))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            if (!problem.title.trim()) {
                toast('Title is required', 'error')
                return
            }
            if (!problem.description.trim()) {
                toast('Description is required', 'error')
                return
            }
            if (problem.testCases.length === 0 || !problem.testCases[0].input.trim()) {
                toast('At least one test case with input is required', 'error')
                return
            }

            const response = await api.post('/problems/create', problem)
            console.log('Response:', response)
            toast('Problem created successfully!', 'success')

            setProblem({
                title: '',
                description: '',
                difficulty: 'Easy',
                tags: [],
                constraints: '',
                hints: [],
                companies: [],
                testCases: [{ input: '', expectedOutput: '', isHidden: false, explanation: '' }],
                isPremium: false
            })
        } catch (error) {
            console.error('Error creating problem:', error)
            toast('Failed to create problem. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-black dark:text-white">Create Problem</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={previewMode ? 'default' : 'outline'}
                            onClick={() => setPreviewMode(!previewMode)}
                            className="transition-colors"
                        >
                            {previewMode ? 'Edit' : 'Preview'}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Problem'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="space-y-8">
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-black dark:text-white">Problem Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label htmlFor="title" className="font-medium text-black dark:text-white">Title</Label>
                                        <Input
                                            id="title"
                                            value={problem.title}
                                            onChange={(e) => setProblem(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter problem title"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="difficulty" className="font-medium text-black dark:text-white">Difficulty</Label>
                                        <select
                                            id="difficulty"
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem(prev => ({ ...prev, difficulty: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="font-medium text-black dark:text-white">Description (Markdown)</Label>
                                        <Textarea
                                            id="description"
                                            value={problem.description}
                                            onChange={(e) => setProblem(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter problem description in Markdown format..."
                                            className="min-h-[200px] font-mono mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="constraints" className="font-medium text-black dark:text-white">Constraints</Label>
                                        <Textarea
                                            id="constraints"
                                            value={problem.constraints}
                                            onChange={(e) => setProblem(prev => ({ ...prev, constraints: e.target.value }))}
                                            placeholder="Enter problem constraints..."
                                            className="min-h-[100px] font-mono mt-1"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <Label className="font-medium text-black dark:text-white">Tags</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                placeholder="Add a tag"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            />
                                            <Button onClick={addTag} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {problem.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {tag}
                                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Companies */}
                                    <div>
                                        <Label className="font-medium text-black dark:text-white">Companies</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                value={companyInput}
                                                onChange={(e) => setCompanyInput(e.target.value)}
                                                placeholder="Add a company"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                                            />
                                            <Button onClick={addCompany} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {problem.companies.map((company, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {company}
                                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompany(company)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hints */}
                                    <div>
                                        <Label className="font-medium text-black dark:text-white">Hints</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                value={hintInput}
                                                onChange={(e) => setHintInput(e.target.value)}
                                                placeholder="Add a hint"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHint())}
                                            />
                                            <Button onClick={addHint} size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            {problem.hints.map((hint, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                                    <span className="flex-1 text-sm">{hint}</span>
                                                    <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeHint(index)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Premium Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="isPremium"
                                            checked={problem.isPremium}
                                            onChange={(e) => setProblem(prev => ({ ...prev, isPremium: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <Label htmlFor="isPremium" className="text-black dark:text-white">Premium Problem</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-lg font-semibold text-black dark:text-white">
                                        Test Cases
                                        <Button size="sm" onClick={addTestCase} className="ml-2">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {problem.testCases.map((testCase, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900 relative group">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-medium text-black dark:text-white">Test Case {index + 1}</Label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={testCase.isHidden}
                                                            onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                                                            className="rounded"
                                                        />
                                                        <Label className="text-sm text-black dark:text-white">Hidden</Label>
                                                    </div>
                                                    {problem.testCases.length > 1 && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            onClick={() => removeTestCase(index)}
                                                            className="opacity-80 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="font-medium text-black dark:text-white">Input</Label>
                                                <Textarea
                                                    value={testCase.input}
                                                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                                    placeholder="Enter test input..."
                                                    className="font-mono mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label className="font-medium text-black dark:text-white">Expected Output</Label>
                                                <Textarea
                                                    value={testCase.expectedOutput}
                                                    onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                                                    placeholder="Enter expected output..."
                                                    className="font-mono mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label className="font-medium text-black dark:text-white">Explanation</Label>
                                                <Textarea
                                                    value={testCase.explanation}
                                                    onChange={(e) => updateTestCase(index, 'explanation', e.target.value)}
                                                    placeholder="Enter explanation for this test case..."
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="space-y-8">
                            <Card className="border-gray-200 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-black dark:text-white">Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {previewMode ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <h2 className="text-2xl font-bold text-black dark:text-white">{problem.title || 'Untitled Problem'}</h2>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        }`}>
                                                        {problem.difficulty}
                                                    </Badge>
                                                    {problem.isPremium && (
                                                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                            Premium
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {problem.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {problem.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {problem.companies.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-black dark:text-white mb-2">Companies</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {problem.companies.map((company, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {company}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="prose prose-sm max-w-none whitespace-pre-wrap break-all overflow-x-auto text-black dark:text-white">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {problem.description || '*No description provided*'}
                                                </ReactMarkdown>
                                            </div>

                                            {problem.constraints && (
                                                <div>
                                                    <h4 className="font-medium text-black dark:text-white mb-2">Constraints</h4>
                                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                                        <pre className="text-sm text-black dark:text-white whitespace-pre-wrap">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {problem.constraints}
                                                            </ReactMarkdown>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {problem.hints.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-black dark:text-white mb-2">Hints</h4>
                                                    <div className="space-y-2">
                                                        {problem.hints.map((hint, index) => (
                                                            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Test Cases</h3>
                                                {problem.testCases.map((testCase, index) => (
                                                    <Card key={index} className="border-gray-200 dark:border-gray-800">
                                                        <CardContent className="p-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="font-medium text-black dark:text-white">Test Case {index + 1}</div>
                                                                    <div className="flex gap-2">
                                                                        {testCase.isHidden && (
                                                                            <Badge variant="outline" className="text-xs">Hidden</Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-black dark:text-white mb-1">Input:</div>
                                                                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                                                        {formatTestCaseText(testCase.input)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-black dark:text-white mb-1">Expected Output:</div>
                                                                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                                                        {formatTestCaseText(testCase.expectedOutput)}
                                                                    </div>
                                                                </div>
                                                                {testCase.explanation && (
                                                                    <div>
                                                                        <div className="text-sm font-medium text-black dark:text-white mb-1">Explanation:</div>
                                                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                                                            <p className="text-sm text-black dark:text-white">{testCase.explanation}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
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