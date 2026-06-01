import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  const username = sessionStorage.getItem('username')
  const password = sessionStorage.getItem('password')
  if (username && password) {
    const token = btoa(`${username}:${password}`)
    config.headers.Authorization = `Basic ${token}`
  }
  return config
})

export default instance
