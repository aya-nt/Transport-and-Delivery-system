import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="bg-surface rounded-xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
        <p className="text-text-secondary">Enter your new password</p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Reset Password
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
