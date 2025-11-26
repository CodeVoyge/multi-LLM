"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role?: "user" | "admin") => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !user && !pathname?.startsWith("/auth")) {
      router.push("/auth/login")
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      let data: any = {}
      const contentType = res.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        data = await res.json()
      }

      if (!res.ok) {
        const errorMessage = data.error || data.message || "Login failed"
        throw new Error(errorMessage)
      }

      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, role: "user" | "admin" = "user") => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      })

      let data: any = {}
      const contentType = res.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        data = await res.json()
      }

      if (!res.ok) {
        const errorMessage = data.error || data.message || "Signup failed"
        throw new Error(errorMessage)
      }

      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
