"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useState } from "react"

export default function AuthPage() {
    const [currentView, setCurrentView] = useState<"login" | "signup" | "forgot">("login")

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">codecoffee</h1>
                    <p className="text-sm text-muted-foreground mt-2">Practice coding, one problem at a time</p>
                </div>

                {currentView === "login" && (
                    <LoginForm
                        onSwitchToSignup={() => setCurrentView("signup")}
                        onSwitchToForgot={() => setCurrentView("forgot")}
                    />
                )}

                {currentView === "signup" && <SignupForm onSwitchToLogin={() => setCurrentView("login")} />}

                {currentView === "forgot" && <ForgotPasswordForm onSwitchToLogin={() => setCurrentView("login")} />}
            </div>
        </div>
    )
}
