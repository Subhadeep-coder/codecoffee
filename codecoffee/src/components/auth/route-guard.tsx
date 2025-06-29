"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

interface RouteGuardProps {
    children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, isInitialized, initializeAuth, checkAuthStatus } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)

    const protectedRoutes = ["/dashboard", "/problems/solve", "/contests", "/submissions", "/profile"]

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    useEffect(() => {
        const initAuth = () => {
            try {
                if (!isInitialized) {
                    initializeAuth()
                }

                const isAuth = checkAuthStatus()

                if (pathname === "/dashboard" && typeof window !== "undefined") {
                    const urlParams = new URLSearchParams(window.location.search)
                    const accessToken = urlParams.get("accessToken")
                    const refreshToken = urlParams.get("refreshToken")

                    if (accessToken && refreshToken) {
                        // OAuth tokens are present, allow access
                        setIsChecking(false)
                        return
                    }
                }

                if (isProtectedRoute && !isAuth) {
                    console.log("Protected route accessed without auth, redirecting...")
                    router.push("/auth")
                    return
                }

                setIsChecking(false)
            } catch (error) {
                console.error("Auth initialization error:", error)
                setIsChecking(false)
                if (isProtectedRoute) {
                    router.push("/auth")
                }
            }
        }

        initAuth()
    }, [pathname, isInitialized, initializeAuth, checkAuthStatus, isProtectedRoute, router])

    if (isChecking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        )
    }

    if (isProtectedRoute && !isAuthenticated && pathname !== "/dashboard") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}