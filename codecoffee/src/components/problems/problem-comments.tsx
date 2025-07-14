"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

interface Comment {
    id: string
    author: {
        username: string
        avatar?: string
    }
    content: string
    timestamp: string
    likes: number
    dislikes: number
    replies: Comment[]
}

interface ProblemCommentsProps {
    problemId: string
}

export function ProblemComments({ problemId }: ProblemCommentsProps) {
    const { isAuthenticated } = useAuthStore()
    const [newComment, setNewComment] = useState("")
    const [comments] = useState<Comment[]>([
        {
            id: "1",
            author: { username: "coder123", avatar: "" },
            content: "Great problem! The key insight is to use a hash map to store the complement of each number.",
            timestamp: "2 hours ago",
            likes: 15,
            dislikes: 2,
            replies: [
                {
                    id: "2",
                    author: { username: "pythondev", avatar: "" },
                    content: "Exactly! This reduces the time complexity from O(n²) to O(n).",
                    timestamp: "1 hour ago",
                    likes: 8,
                    dislikes: 0,
                    replies: [],
                },
            ],
        },
        {
            id: "3",
            author: { username: "algorithm_master", avatar: "" },
            content: "For beginners: try the brute force approach first, then optimize with hash map.",
            timestamp: "4 hours ago",
            likes: 23,
            dislikes: 1,
            replies: [],
        },
    ])

    const handleSubmitComment = () => {
        if (!newComment.trim()) return
        // Add comment logic here
        setNewComment("")
    }

    const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`${isReply ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
            <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.author.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground">{comment.author.username}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-foreground mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            {comment.dislikes}
                        </Button>
                        {!isReply && isAuthenticated && (
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {comment.replies.map((reply) => (
                <CommentComponent key={reply.id} comment={reply} isReply />
            ))}
        </div>
    )

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Comments ({comments.length})</h2>

            {isAuthenticated && (
                <div className="mb-6">
                    <Textarea
                        placeholder="Share your thoughts or solution approach..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-3"
                    />
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                        Post Comment
                    </Button>
                </div>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))}
            </div>

            {!isAuthenticated && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>Sign in to join the discussion</p>
                </div>
            )}
        </div>
    )
}
