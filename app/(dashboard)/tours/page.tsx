import BackButton from "@/components/layout/back-button"

export default function ToursPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Delivery Tours</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          Create Tour
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <p className="text-text-secondary">Delivery tours management goes here</p>
      </div>
    </div>
  )
}
