import BackButton from "@/components/layout/back-button"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Payments</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <p className="text-text-secondary">Payments management table goes here</p>
      </div>
    </div>
  )
}
