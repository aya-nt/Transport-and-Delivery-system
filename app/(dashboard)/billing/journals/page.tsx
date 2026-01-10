import BackButton from "@/components/layout/back-button"

export default function FinancialJournalsPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-foreground">Financial Journals</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <p className="text-muted-foreground">Financial journals table goes here</p>
      </div>
    </div>
  )
}
