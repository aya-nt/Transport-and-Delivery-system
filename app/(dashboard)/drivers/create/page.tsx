import BackButton from "@/components/layout/back-button"

export default function CreateDriverPage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Add Driver</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter driver's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter license number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="driver@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select status</option>
                <option value="available">Available</option>
                <option value="on-route">On Route</option>
                <option value="off-duty">Off Duty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Expiry Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter driver's address"
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
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

