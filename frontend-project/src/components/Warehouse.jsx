import React, { useState, useEffect } from 'react'
import axios from '../api/axios'

function Warehouse() {
  const [warehouses, setWarehouses] = useState([])
  const [form, setForm] = useState({
    warehouseCode: '', warehouseName: '', warehouseLocation: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => { fetchWarehouses() }, [])

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
      const res = await axios.post('/warehouses', form)
      setMessage(res.data.message)
      setForm({ warehouseCode: '', warehouseName: '', warehouseLocation: '' })
      fetchWarehouses()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding warehouse')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Warehouse</h2>
        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Code</label>
            <input type="text" name="warehouseCode" value={form.warehouseCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
            <input type="text" name="warehouseName" value={form.warehouseName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Location</label>
            <input type="text" name="warehouseLocation" value={form.warehouseLocation} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
              Add Warehouse
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-6 pb-0">Warehouse List</h2>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">Code</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Location</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length === 0 ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-500">No warehouses found</td></tr>
              ) : (
                warehouses.map(w => (
                  <tr key={w.warehouseCode} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{w.warehouseCode}</td>
                    <td className="py-3 px-4">{w.warehouseName}</td>
                    <td className="py-3 px-4">{w.warehouseLocation}</td>
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

export default Warehouse
