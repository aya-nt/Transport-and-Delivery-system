import BackButton from "@/components/layout/back-button"

export default function CreateVehiclePage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-text-primary">Add Vehicle</h1>

      <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Plate Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ABC-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Type</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select vehicle type</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Capacity (kg)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select status</option>
                <option value="available">Available</option>
                <option value="in-use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="out-of-service">Out of Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Make</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Ford, Toyota"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Transit, Hiace"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Registration Expiry Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Additional notes about the vehicle..."
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
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

