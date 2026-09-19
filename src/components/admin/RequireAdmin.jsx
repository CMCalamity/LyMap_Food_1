import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isAdminLoggedIn } from '../../utils/adminAuth'

export default function RequireAdmin({ children }) {
  const [checked, setChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn())
    setChecked(true)
  }, [])

  if (!checked) return null

  if (!loggedIn) {
    alert('Bạn chưa đăng nhập quyền Admin!')
    return <Navigate to="/Admin/Login" replace />
  }

  return children
}
