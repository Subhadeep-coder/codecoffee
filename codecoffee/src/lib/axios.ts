import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { useAuthStore } from "../stores/auth-store"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
})

let isRefreshing = false
let failedQueue: Array<{
    resolve: (value: any) => void
    reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(token)
        }
    })

    failedQueue = []
}

const refreshToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refreshToken")

    if (!refreshToken) {
        throw new Error("No refresh token available")
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        localStorage.setItem("accessToken", accessToken)
        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken)
        }

        const { setTokens } = useAuthStore.getState()
        setTokens(accessToken, newRefreshToken || refreshToken)

        return accessToken
    } catch (error) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")

        const { logout } = useAuthStore.getState()
        logout()

        if (typeof window !== "undefined") {
            window.location.href = "/auth"
        }

        throw error
    }
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers = config.headers ?? {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                    }
                    return api(originalRequest)
                }).catch((err) => {
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const newToken = await refreshToken()
                processQueue(null, newToken)

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                }

                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export { api }