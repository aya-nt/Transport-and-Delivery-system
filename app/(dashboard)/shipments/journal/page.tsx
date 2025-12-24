import BackButton from "@/components/layout/back-button"

export default function ShipmentsJournalPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Shipments Journal</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <p className="text-text-secondary">Shipments journal table goes here</p>
      </div>
    </div>
  )
}
