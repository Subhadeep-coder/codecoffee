'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Home, Plus, Trash2, Save, X, Eye, Edit, Code, TestTube, FileText, Settings, Lock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'

interface TestCaseDto {
    input: string
    expectedOutput: string
    isHidden: boolean
    explanation?: string
}

interface ProblemTemplateDto {
    language: string
    template: string
}

interface InputFormatDto {
    format: string
    description?: string
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
    problemTemplates?: ProblemTemplateDto[]
    inputFormats?: InputFormatDto[]
}

const PROGRAMMING_LANGUAGES = [
    'JavaScript', 'Python', 'Java', 'C++', 'C', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'TypeScript'
]

export default function CreatePage() {
    const router = useRouter();
    const [problem, setProblem] = useState<CreateProblemsDto>({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: [],
        constraints: '',
        hints: [],
        companies: [],
        testCases: [{ input: '', expectedOutput: '', isHidden: false, explanation: '' }],
        isPremium: false,
        problemTemplates: [],
        inputFormats: []
    })

    const [previewMode, setPreviewMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('basic')

    // Input states for dynamic arrays
    const [tagInput, setTagInput] = useState('')
    const [hintInput, setHintInput] = useState('')
    const [companyInput, setCompanyInput] = useState('')
    const [inputFormatInput, setInputFormatInput] = useState('')
    const [inputFormatDesc, setInputFormatDesc] = useState('')

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

    const addTemplate = () => {
        setProblem(prev => ({
            ...prev,
            problemTemplates: [...(prev.problemTemplates || []), { language: 'JavaScript', template: '' }]
        }))
    }

    const removeTemplate = (index: number) => {
        setProblem(prev => ({
            ...prev,
            problemTemplates: prev.problemTemplates?.filter((_, i) => i !== index) || []
        }))
    }

    const updateTemplate = (index: number, field: keyof ProblemTemplateDto, value: string) => {
        setProblem(prev => ({
            ...prev,
            problemTemplates: prev.problemTemplates?.map((template, i) =>
                i === index ? { ...template, [field]: value } : template
            ) || []
        }))
    }

    const addInputFormat = () => {
        if (inputFormatInput.trim()) {
            setProblem(prev => ({
                ...prev,
                inputFormats: [...(prev.inputFormats || []), {
                    format: inputFormatInput.trim(),
                    description: inputFormatDesc.trim() || undefined
                }]
            }))
            setInputFormatInput('')
            setInputFormatDesc('')
        }
    }

    const removeInputFormat = (index: number) => {
        setProblem(prev => ({
            ...prev,
            inputFormats: prev.inputFormats?.filter((_, i) => i !== index) || []
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
                toast.error('Title is required')
                return
            }
            if (!problem.description.trim()) {
                toast.error('Description is required')
                return
            }
            if (problem.testCases.length === 0 || !problem.testCases[0].input.trim()) {
                toast.error('At least one test case with input is required')
                return
            }

            // Simulate API call
            console.log('Submitting problem:', problem)
            const response = await api.post('/problems/create', problem)

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success('Problem created successfully!')

            // Reset form
            setProblem({
                title: '',
                description: '',
                difficulty: 'Easy',
                tags: [],
                constraints: '',
                hints: [],
                companies: [],
                testCases: [{ input: '', expectedOutput: '', isHidden: false, explanation: '' }],
                isPremium: false,
                problemTemplates: [],
                inputFormats: []
            })
            setActiveTab('basic')
            setPreviewMode(false)
            router.replace('/problems');
        } catch (error) {
            console.error('Error creating problem:', error)
            toast.error('Failed to create problem. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const tabsConfig = [
        { id: 'basic', label: 'Basic Info', icon: FileText },
        { id: 'templates', label: 'Code Templates', icon: Code },
        { id: 'testcases', label: 'Test Cases', icon: TestTube },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="p-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form Section */}
                        <div className="space-y-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    {tabsConfig.map(tab => {
                                        const Icon = tab.icon
                                        return (
                                            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>

                                {/* Basic Info Tab */}
                                <TabsContent value="basic" className="space-y-6">
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
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Code Templates Tab */}
                                <TabsContent value="templates" className="space-y-6">
                                    <Card className="border-gray-200 dark:border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between text-lg font-semibold text-black dark:text-white">
                                                Code Templates
                                                <Button size="sm" onClick={addTemplate}>
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Template
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {problem.problemTemplates?.map((template, index) => (
                                                <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-medium text-black dark:text-white">Template {index + 1}</Label>
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            onClick={() => removeTemplate(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div>
                                                        <Label className="font-medium text-black dark:text-white">Language</Label>
                                                        <select
                                                            value={template.language}
                                                            onChange={(e) => updateTemplate(index, 'language', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                        >
                                                            {PROGRAMMING_LANGUAGES.map(lang => (
                                                                <option key={lang} value={lang}>{lang}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <Label className="font-medium text-black dark:text-white">Template Code</Label>
                                                        <Textarea
                                                            value={template.template}
                                                            onChange={(e) => updateTemplate(index, 'template', e.target.value)}
                                                            placeholder="Enter starter code template..."
                                                            className="min-h-[200px] font-mono mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            )) || (
                                                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                        <p>No templates added yet. Click "Add Template" to get started.</p>
                                                    </div>
                                                )}

                                            {/* Input Formats */}
                                            <div className="border-t pt-6">
                                                <Label className="font-medium text-black dark:text-white text-lg">Input Formats</Label>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <Input
                                                        value={inputFormatInput}
                                                        onChange={(e) => setInputFormatInput(e.target.value)}
                                                        placeholder="Format (e.g., Array, String)"
                                                    />
                                                    <Input
                                                        value={inputFormatDesc}
                                                        onChange={(e) => setInputFormatDesc(e.target.value)}
                                                        placeholder="Description (optional)"
                                                    />
                                                </div>
                                                <Button onClick={addInputFormat} size="sm" className="mt-2">
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Format
                                                </Button>

                                                <div className="space-y-2 mt-4">
                                                    {problem.inputFormats?.map((format, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                                            <div>
                                                                <span className="font-medium">{format.format}</span>
                                                                {format.description && (
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                                                        - {format.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <X
                                                                className="h-4 w-4 cursor-pointer text-red-500"
                                                                onClick={() => removeInputFormat(index)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Test Cases Tab */}
                                <TabsContent value="testcases" className="space-y-6">
                                    <Card className="border-gray-200 dark:border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between text-lg font-semibold text-black dark:text-white">
                                                Test Cases
                                                <Button size="sm" onClick={addTestCase}>
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Test Case
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {problem.testCases.map((testCase, index) => (
                                                <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
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
                                </TabsContent>

                                {/* Settings Tab */}
                                <TabsContent value="settings" className="space-y-6">
                                    <Card className="border-gray-200 dark:border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-black dark:text-white">Problem Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
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

                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Additional Settings</h4>
                                                <p className="text-sm text-blue-800 dark:text-blue-400">
                                                    More settings like publishing status, visibility, and editorial notes can be added here.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                            {/* Create Button Section */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    size="lg"
                                    className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Problem
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="border-gray-200 dark:border-gray-800"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    {previewMode ? 'Edit Mode' : 'Preview'}
                                </Button>
                            </div>
                        </div>
                        {/* Preview Section */}
                        <div className="space-y-6">
                            <Card className="border-gray-200 dark:border-gray-800 sticky top-6">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                    <div className="space-y-6">
                                        {/* Problem Header */}
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <h2 className="text-2xl font-bold text-black dark:text-white flex-1">
                                                    {problem.title || 'Untitled Problem'}
                                                </h2>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Badge className={`${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        }`}>
                                                        {problem.difficulty}
                                                    </Badge>
                                                    {problem.isPremium && (
                                                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                            <Lock className="h-3 w-3 mr-1" />
                                                            Premium
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {problem.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {problem.tags.map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Companies */}
                                            {problem.companies.length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Asked by:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {problem.companies.map((company, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {company}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Problem Description */}
                                        {problem.description && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Problem Description</h3>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                        {problem.description}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Input Formats */}
                                        {problem.inputFormats && problem.inputFormats.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Input Format</h3>
                                                <div className="space-y-2">
                                                    {problem.inputFormats.map((format, index) => (
                                                        <div key={index} className="text-sm">
                                                            <span className="font-medium text-black dark:text-white">{format.format}</span>
                                                            {format.description && (
                                                                <span className="text-gray-600 dark:text-gray-400 ml-2">- {format.description}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Constraints */}
                                        {problem.constraints && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Constraints</h3>
                                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                                        {problem.constraints}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}

                                        {/* Test Cases */}
                                        {problem.testCases.some(tc => tc.input && !tc.isHidden) && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Example</h3>
                                                <div className="space-y-4">
                                                    {problem.testCases
                                                        .filter(tc => tc.input && !tc.isHidden)
                                                        .map((testCase, index) => (
                                                            <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Input:</h4>
                                                                    <pre className="text-sm bg-white dark:bg-black p-2 rounded border text-gray-800 dark:text-gray-200 font-mono">
                                                                        {testCase.input || 'No input provided'}
                                                                    </pre>
                                                                </div>
                                                                {testCase.expectedOutput && (
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Output:</h4>
                                                                        <pre className="text-sm bg-white dark:bg-black p-2 rounded border text-gray-800 dark:text-gray-200 font-mono">
                                                                            {testCase.expectedOutput}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {testCase.explanation && (
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Explanation:</h4>
                                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                            {testCase.explanation}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hints */}
                                        {problem.hints.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Hints</h3>
                                                <div className="space-y-2">
                                                    {problem.hints.map((hint, index) => (
                                                        <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                                                <span className="font-medium">Hint {index + 1}:</span> {hint}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Code Templates Preview */}
                                        {problem.problemTemplates && problem.problemTemplates.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-black dark:text-white">Code Templates</h3>
                                                <div className="space-y-3">
                                                    {problem.problemTemplates.map((template, index) => (
                                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {template.language}
                                                                </Badge>
                                                            </div>
                                                            {template.template && (
                                                                <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                                                                    <code className="text-gray-800 dark:text-gray-200">
                                                                        {template.template}
                                                                    </code>
                                                                </pre>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {!problem.title && !problem.description && (
                                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>Start filling out the form to see the preview</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}