import React, { useState } from 'react'
import axios from '../api/axios'

function Reports() {
  const [activeTab, setActiveTab] = useState('stock')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async (type) => {
    setLoading(true)
    setError('')
    setActiveTab(type)
    try {
      const endpoints = {
        stock: '/reports/stock-availability',
        daily: '/reports/daily',
        weekly: '/reports/weekly',
        monthly: '/reports/monthly'
      }
      const res = await axios.get(endpoints[type])
      setData(res.data)
    } catch (err) {
      setError('Error fetching report')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'stock', label: 'Stock Availability' },
    { key: 'daily', label: 'Daily Report' },
    { key: 'weekly', label: 'Weekly Report' },
    { key: 'monthly', label: 'Monthly Report' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory Reports</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => fetchReport(tab.key)}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {data.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>
        )}

        {loading && <p className="text-gray-500 text-center py-8">Loading report...</p>}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No data available</p>
            <p className="text-gray-400 text-sm mt-2">Click a report button above to load data</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="overflow-x-auto">
            {activeTab === 'stock' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">Code</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Product</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Qty In Stock</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Unit Price</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Total Value</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Supplier</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Date Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{row.productCode}</td>
                      <td className="py-3 px-4">{row.productName}</td>
                      <td className="py-3 px-4">{row.category}</td>
                      <td className="py-3 px-4">{row.quantityInStock}</td>
                      <td className="py-3 px-4">{row.unitPrice}</td>
                      <td className="py-3 px-4">{row.totalValue}</td>
                      <td className="py-3 px-4">{row.supplierName}</td>
                      <td className="py-3 px-4">{row.dateReceived?.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'daily' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Product</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Warehouse</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Stock In</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Stock Out</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Qty Moved</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Type</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Current Stock</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">New Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{row.transactionDate?.split('T')[0]}</td>
                      <td className="py-3 px-4">{row.productName}</td>
                      <td className="py-3 px-4">{row.category}</td>
                      <td className="py-3 px-4">{row.warehouseName}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{row.stockIn || '-'}</td>
                      <td className="py-3 px-4 text-red-600 font-medium">{row.stockOut || '-'}</td>
                      <td className="py-3 px-4">{row.quantityMoved}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.transactionType === 'Stock In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {row.transactionType || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{row.currentStock}</td>
                      <td className="py-3 px-4">{row.newStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {(activeTab === 'weekly' || activeTab === 'monthly') && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-600">{activeTab === 'weekly' ? 'Week' : 'Month'}</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Product</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Warehouse</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Total Stock In</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Total Stock Out</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Current Stock</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {activeTab === 'weekly' ? `Week ${row.week}` : row.month}
                      </td>
                      <td className="py-3 px-4">{row.productName}</td>
                      <td className="py-3 px-4">{row.category}</td>
                      <td className="py-3 px-4">{row.warehouseName}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{row.totalStockIn}</td>
                      <td className="py-3 px-4 text-red-600 font-medium">{row.totalStockOut}</td>
                      <td className="py-3 px-4">{row.quantityInStock}</td>
                      <td className="py-3 px-4">{row.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
