import BackButton from "@/components/layout/back-button"

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Pricing</h1>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-colors shadow-lg hover:shadow-xl">
          Add Pricing Rule
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <p className="text-muted-foreground">Pricing management table goes here</p>
      </div>
    </div>
  )
}
