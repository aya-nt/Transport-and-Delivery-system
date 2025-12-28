import BackButton from "@/components/layout/back-button"

export default function CreateClientPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Add Client</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter client's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter company name (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter client's address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Client Type</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select client type</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Additional notes about the client..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

