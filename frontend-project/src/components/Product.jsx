import React, { useState, useEffect } from 'react'
import axios from '../api/axios'

function Product() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    productCode: '', productName: '', category: '', quantityInStock: '',
    unitPrice: '', supplierName: '', dateReceived: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products')
      setProducts(res.data)
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
      const res = await axios.post('/products', form)
      setMessage(res.data.message)
      setForm({ productCode: '', productName: '', category: '', quantityInStock: '', unitPrice: '', supplierName: '', dateReceived: '' })
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding product')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h2>
        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
            <input type="text" name="productCode" value={form.productCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="productName" value={form.productName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity In Stock</label>
            <input type="number" name="quantityInStock" value={form.quantityInStock} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
            <input type="number" step="0.01" name="unitPrice" value={form.unitPrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input type="text" name="supplierName" value={form.supplierName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Received</label>
            <input type="date" name="dateReceived" value={form.dateReceived} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
              Add Product
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-6 pb-0">Product List</h2>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">Code</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Category</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Qty</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Price</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Supplier</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-gray-500">No products found</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.productCode} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{p.productCode}</td>
                    <td className="py-3 px-4">{p.productName}</td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4">{p.quantityInStock}</td>
                    <td className="py-3 px-4">{p.unitPrice}</td>
                    <td className="py-3 px-4">{p.supplierName}</td>
                    <td className="py-3 px-4">{p.dateReceived?.split('T')[0]}</td>
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

export default Product
