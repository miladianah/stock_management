import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/reports/dashboard')
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>
  }

  if (!data) {
    return <div className="text-center py-12 text-gray-500">Failed to load dashboard data</div>
  }

  const cards = [
    { label: 'Total Products', value: data.totalProducts, color: 'bg-blue-500', link: '/products' },
    { label: 'Total Warehouses', value: data.totalWarehouses, color: 'bg-green-500', link: '/warehouses' },
    { label: 'Total Transactions', value: data.totalTransactions, color: 'bg-purple-500', link: '/transactions' },
    { label: 'Total Stock Value', value: `Rwf ${Number(data.totalStockValue).toLocaleString()}`, color: 'bg-yellow-500', link: '/reports' },
    { label: 'Total Stock In', value: data.totalStockIn, color: 'bg-teal-500', link: '/transactions' },
    { label: 'Total Stock Out', value: data.totalStockOut, color: 'bg-red-500', link: '/transactions' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.link)}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{String(card.value).charAt(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Low Stock Products</h3>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-gray-500">No low stock products</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Product</th>
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Qty</th>
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStockProducts.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 px-3">{p.productName}</td>
                      <td className="py-2 px-3">{p.quantityInStock}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {p.quantityInStock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          {data.recentTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Product</th>
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Date</th>
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Qty</th>
                    <th className="py-2 px-3 font-semibold text-gray-600 text-sm">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((t, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 px-3">{t.productName}</td>
                      <td className="py-2 px-3 text-sm">{t.transactionDate?.split('T')[0]}</td>
                      <td className="py-2 px-3">{t.quantityMoved}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.transactionType === 'Stock In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {t.transactionType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
