"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add actual authentication logic here
    console.log("[v0] Login form submitted:", formData)
    router.push("/dashboard")
  }

  return (
    <div className="bg-surface rounded-xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 7H16V3H8V7H5C3.9 7 3 7.9 3 9V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V9C21 7.9 20.1 7 19 7ZM10 5H14V7H10V5ZM5 17V9H19V17H5Z"
                fill="#ffffff"
              />
              <circle cx="7" cy="13" r="1.5" fill="#ffffff" />
              <circle cx="17" cy="13" r="1.5" fill="#ffffff" />
              <path d="M12 11L9 14H15L12 11Z" fill="#60a5fa" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to SwiftDeliver</h1>
        <p className="text-text-secondary">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer hover:scale-105 transition-transform">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline hover:scale-105 transition-all">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
