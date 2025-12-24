"use client"

import { useState } from "react"
import BackButton from "@/components/layout/back-button"

export default function InvoicesPage() {
  const [invoices] = useState([
    {
      id: "INV-001",
      client: "John Doe",
      amount: "$1,250",
      date: "2024-01-15",
      status: "Paid",
    },
    {
      id: "INV-002",
      client: "Jane Smith",
      amount: "$890",
      date: "2024-01-18",
      status: "Pending",
    },
  ])

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Invoices</h1>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          Create Invoice
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Invoice ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{invoice.client}</td>
                <td className="px-6 py-4 text-sm text-text-primary font-semibold">{invoice.amount}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{invoice.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      invoice.status === "Paid" ? "bg-green-100 text-success" : "bg-yellow-100 text-warning"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline hover:scale-105 transition-all mr-3 font-medium">
                    View
                  </button>
                  <button className="text-primary hover:underline hover:scale-105 transition-all font-medium">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
