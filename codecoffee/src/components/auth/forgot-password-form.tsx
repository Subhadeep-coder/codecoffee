"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"

interface ForgotPasswordFormProps {
    onSwitchToLogin: () => void
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Add your forgot password logic here
        setTimeout(() => {
            setIsLoading(false)
            setIsEmailSent(true)
        }, 1000)
    }

    if (isEmailSent) {
        return (
            <Card className="border-border bg-card">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Mail className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-card-foreground">Check your email</CardTitle>
                    <p className="text-sm text-muted-foreground">We've sent a password reset link to your email address</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={onSwitchToLogin}
                        variant="outline"
                        className="w-full border-border bg-background text-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to sign in
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border bg-card">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold text-card-foreground">Forgot password?</CardTitle>
                <p className="text-sm text-muted-foreground">Enter your email address and we'll send you a reset link</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <Button
                        type="submit"
                        className="w-full bg-foreground text-background hover:bg-foreground/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send reset link"}
                    </Button>
                </form>

                <Button
                    onClick={onSwitchToLogin}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                </Button>
            </CardContent>
        </Card>
    )
}
