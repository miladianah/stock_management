import React, { useState, useEffect } from 'react'
import axios from '../api/axios'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    productCode: '', warehouseCode: '', transactionDate: '',
    quantityMoved: '', transactionType: 'Stock In'
  })

  useEffect(() => {
    fetchTransactions()
    fetchProducts()
    fetchWarehouses()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions')
      setTransactions(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('/warehouses')
      setWarehouses(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const res = await axios.put(`/transactions/${editingId}`, form)
        setMessage(res.data.message)
        setEditingId(null)
      } else {
        const res = await axios.post('/transactions', form)
        setMessage(res.data.message)
      }
      setForm({ productCode: '', warehouseCode: '', transactionDate: '', quantityMoved: '', transactionType: 'Stock In' })
      fetchTransactions()
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error saving transaction')
    }
  }

  const handleEdit = (t) => {
    setEditingId(t.transactionId)
    setForm({
      productCode: t.productCode,
      warehouseCode: t.warehouseCode,
      transactionDate: t.transactionDate?.split('T')[0] || '',
      quantityMoved: t.quantityMoved,
      transactionType: t.transactionType
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    try {
      const res = await axios.delete(`/transactions/${id}`)
      setMessage(res.data.message)
      fetchTransactions()
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error deleting transaction')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ productCode: '', warehouseCode: '', transactionDate: '', quantityMoved: '', transactionType: 'Stock In' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingId ? 'Update Transaction' : 'Add Transaction'}
        </h2>
        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select name="productCode" value={form.productCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.productCode} value={p.productCode}>{p.productName} ({p.productCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select name="warehouseCode" value={form.warehouseCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select Warehouse</option>
              {warehouses.map(w => (
                <option key={w.warehouseCode} value={w.warehouseCode}>{w.warehouseName} ({w.warehouseCode})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
            <input type="date" name="transactionDate" value={form.transactionDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Moved</label>
            <input type="number" name="quantityMoved" value={form.quantityMoved} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select name="transactionType" value={form.transactionType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button type="submit" className={`flex-1 text-white py-2 rounded-lg transition font-medium ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-medium">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-6 pb-0">Transaction List</h2>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Product</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Warehouse</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Qty</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Type</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-gray-500">No transactions found</td></tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.transactionId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{t.transactionId}</td>
                    <td className="py-3 px-4">{t.productName || t.productCode}</td>
                    <td className="py-3 px-4">{t.warehouseName || t.warehouseCode}</td>
                    <td className="py-3 px-4">{t.transactionDate?.split('T')[0]}</td>
                    <td className="py-3 px-4">{t.quantityMoved}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${t.transactionType === 'Stock In' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleEdit(t)} className="text-indigo-600 hover:text-indigo-800 mr-3 font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(t.transactionId)} className="text-red-600 hover:text-red-800 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions
