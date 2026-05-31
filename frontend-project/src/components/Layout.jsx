import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Layout({ children, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition duration-200 ${
      isActive
        ? 'bg-white text-indigo-600 font-semibold'
        : 'text-white hover:bg-indigo-500'
    }`

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">StockHub</span>
            </div>
            <div className="flex space-x-2">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/warehouses" className={linkClass}>Warehouses</NavLink>
              <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
              <NavLink to="/reports" className={linkClass}>Reports</NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-white hover:bg-red-500 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout
