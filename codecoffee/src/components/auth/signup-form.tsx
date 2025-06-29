"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Mail } from "lucide-react"

interface SignupFormProps {
    onSwitchToLogin: () => void
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Add your signup logic here
        setTimeout(() => setIsLoading(false), 1000)
    }

    return (
        <Card className="border-border bg-card">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold text-card-foreground">Create account</CardTitle>
                <p className="text-sm text-muted-foreground">Enter your information to create your account</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                                First name
                            </Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                required
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                                Last name
                            </Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                required
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            required
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                            Confirm password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            required
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-foreground text-background hover:bg-foreground/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                </form>

                <Separator className="bg-border" />

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full border-border bg-background text-foreground hover:bg-muted"
                        onClick={() => {
                            window.location.href = "http://localhost:5000/api/v1/auth/google";
                        }}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full border-border bg-background text-foreground hover:bg-muted"
                        onClick={() => {
                            window.location.href = "http://localhost:5000/api/v1/auth/github";
                        }}
                    >
                        <Github className="mr-2 h-4 w-4" />
                        Continue with GitHub
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button onClick={onSwitchToLogin} className="text-foreground hover:underline underline-offset-4 font-medium">
                        Sign in
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
