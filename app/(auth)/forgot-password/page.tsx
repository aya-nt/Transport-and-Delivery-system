import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="bg-surface rounded-xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password</h1>
        <p className="text-text-secondary">Enter your email to reset your password</p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Send Reset Link
        </button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
