import BackButton from "@/components/layout/back-button"

export default function ReportIncidentPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Report Incident</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Incident Type</label>
            <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Select incident type</option>
              <option>Damaged Package</option>
              <option>Lost Package</option>
              <option>Delayed Delivery</option>
              <option>Wrong Address</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the incident..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
