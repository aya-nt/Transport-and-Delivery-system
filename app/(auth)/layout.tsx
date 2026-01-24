import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-2/10 dark:from-primary/5 dark:via-chart-3/5 dark:to-chart-2/5 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
