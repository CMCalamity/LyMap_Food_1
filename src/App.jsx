import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminIndex from './pages/admin/AdminIndex'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCreate from './pages/admin/AdminCreate'
import AdminEdit from './pages/admin/AdminEdit'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSettings from './pages/admin/AdminSettings'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminInventory from './pages/admin/AdminInventory'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminReports from './pages/admin/AdminReports'
import AdminContent from './pages/admin/AdminContent'
import AdminMix from './pages/admin/AdminMix'
import AdminCombos from './pages/admin/AdminCombos'
import RequireAdmin from './components/admin/RequireAdmin'
import './App.css'

function NavigateToAdmin() {
  return <Navigate to="/Admin/Index" replace />
}

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/Admin" element={<NavigateToAdmin />} />
    <Route path="/admin" element={<NavigateToAdmin />} />
    <Route path="/Admin/Login" element={<AdminLogin />} />
    <Route path="/Admin/Register" element={<AdminRegister />} />
    <Route path="/Admin/Index" element={<RequireAdmin><AdminIndex /></RequireAdmin>} />
    <Route path="/Admin/Products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
    <Route path="/Admin/Create" element={<RequireAdmin><AdminCreate /></RequireAdmin>} />
    <Route path="/Admin/Edit" element={<RequireAdmin><AdminEdit /></RequireAdmin>} />
    <Route path="/Admin/Orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
    <Route path="/Admin/Reviews" element={<RequireAdmin><AdminReviews /></RequireAdmin>} />
    <Route path="/Admin/Settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
    <Route path="/Admin/Promotions" element={<RequireAdmin><AdminPromotions /></RequireAdmin>} />
    <Route path="/Admin/Inventory" element={<RequireAdmin><AdminInventory /></RequireAdmin>} />
    <Route path="/Admin/Customers" element={<RequireAdmin><AdminCustomers /></RequireAdmin>} />
    <Route path="/Admin/Reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />
    <Route path="/Admin/Content" element={<RequireAdmin><AdminContent /></RequireAdmin>} />
    <Route path="/Admin/Mix" element={<RequireAdmin><AdminMix /></RequireAdmin>} />
    <Route path="/Admin/Combos" element={<RequireAdmin><AdminCombos /></RequireAdmin>} />
  </Routes>
}
