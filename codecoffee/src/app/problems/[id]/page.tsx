"use client"

import { useEffect, useState } from "react"
//import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorComponent } from "@/components/editor"
import { SubmissionResult } from "@/components/submission-result"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Send } from "lucide-react"

interface ProblemDetail {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  constraints: string[]
  tags: string[]
}

interface SubmissionResponse {
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
  runtime?: string
  memory?: string
  output?: string
  error?: string
  testCases?: {
    input: string
    expectedOutput: string
    actualOutput?: string
    passed?: boolean
  }[]
}

export default function ProblemPage({ params }: { params: { id: string } }) {
 // const { toast } = useToast()
  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [submitting, setSubmitting] = useState(false)
  const [running, setRunning] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/problems/${params.id}`)
        // const data = response.data
        // Mock data for demonstration
        const mockProblem: ProblemDetail = {
          id: params.id,
          title: "Two Sum",
          difficulty: "Easy",
          description: `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.
          `,
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            {
              input: "nums = [3,2,4], target = 6",
              output: "[1,2]",
            },
            {
              input: "nums = [3,3], target = 6",
              output: "[0,1]",
            },
          ],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
          ],
          tags: ["Array", "Hash Table"],
        }

        setProblem(mockProblem)

        // Set default code template based on language
        setCode(`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
}
`)
      } catch (error) {
        console.error("Error fetching problem:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to load problem details",
        //   variant: "destructive",
        // })
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [params.id,
    // toast
    ])

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleRun = async () => {
    try {
      setRunning(true)
      setSubmissionResult(null)

      // In a real app, this would be an API call
      // const response = await axios.post("/api/run", {
      //   code,
      //   language,
      //   problemId: params.id
      // })

      // Mock response for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockResponse: SubmissionResponse = {
        status: "Accepted",
        runtime: "56 ms",
        memory: "42.1 MB",
        output: "[0, 1]",
        testCases: [
          {
            input: "nums = [2,7,11,15], target = 9",
            expectedOutput: "[0,1]",
            actualOutput: "[0,1]",
            passed: true,
          },
        ],
      }

      setSubmissionResult(mockResponse)
    } catch (error) {
      console.error("Error running code:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to run your code",
    //     variant: "destructive",
    //   })
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setSubmissionResult(null)

      // In a real app, this would be an API call
      // const response = await axios.post("/api/submit", {
      //   code,
      //   language,
      //   problemId: params.id
      // })

      // Mock response for demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse: SubmissionResponse = {
        status: "Accepted",
        runtime: "56 ms",
        memory: "42.1 MB",
        testCases: [
          {
            input: "nums = [2,7,11,15], target = 9",
            expectedOutput: "[0,1]",
            actualOutput: "[0,1]",
            passed: true,
          },
          {
            input: "nums = [3,2,4], target = 6",
            expectedOutput: "[1,2]",
            actualOutput: "[1,2]",
            passed: true,
          },
          {
            input: "nums = [3,3], target = 6",
            expectedOutput: "[0,1]",
            actualOutput: "[0,1]",
            passed: true,
          },
        ],
      }

      setSubmissionResult(mockResponse)

    //   toast({
    //     title: mockResponse.status,
    //     description:
    //       mockResponse.status === "Accepted"
    //         ? "Your solution passed all test cases!"
    //         : "Your solution didn't pass all test cases.",
    //     variant: mockResponse.status === "Accepted" ? "default" : "destructive",
    //   })
    } catch (error) {
      console.error("Error submitting code:", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to submit your code",
    //     variant: "destructive",
    //   })
    } finally {
      setSubmitting(false)
    }
  }

  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Problem not found</h1>
          <p className="text-muted-foreground mt-2">
            The problem you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, "<br />") }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="example1" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    {problem.examples.map((_, index) => (
                      <TabsTrigger key={index} value={`example${index + 1}`}>
                        Example {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {problem.examples.map((example, index) => (
                    <TabsContent key={index} value={`example${index + 1}`} className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Input:</h4>
                        <pre className="bg-muted/50 p-2 rounded-md text-sm">{example.input}</pre>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Output:</h4>
                        <pre className="bg-muted/50 p-2 rounded-md text-sm">{example.output}</pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <h4 className="font-medium mb-1">Explanation:</h4>
                          <p className="text-sm">{example.explanation}</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {submissionResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <SubmissionResult {...submissionResult} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <EditorComponent defaultLanguage={language} defaultValue={code} onChange={handleCodeChange} height="60vh" />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleRun} disabled={running || submitting}>
                {running ? (
                  <>
                    <Play className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
              <Button onClick={handleSubmit} disabled={running || submitting}>
                {submitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
