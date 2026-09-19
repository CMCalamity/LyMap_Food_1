import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Clock3, Star, Banknote, PlusCircle, TicketPercent, AlertTriangle, MessageCircle } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import RequireAdmin from '../../components/admin/RequireAdmin'
import { getDashboardStats, getOrders, formatVnd, getStoreSettings } from '../../utils/storage'

function AdminIndexInner() {
  const [stats, setStats] = useState(getDashboardStats())
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(getStoreSettings())

  useEffect(() => {
    setStats(getDashboardStats())
    setOrders(getOrders().slice(0, 5))
    setSettings(getStoreSettings())
  }, [])

  const cards = [
    ['Sản phẩm', stats.products, Package],
    ['Đơn hàng', stats.orders, ShoppingCart],
    ['Chờ xác nhận', stats.pendingOrders, Clock3],
    ['Đánh giá', stats.reviews, Star],
    ['Doanh thu', formatVnd(stats.revenue), Banknote],
    ['Mã đang chạy', stats.coupons, TicketPercent],
    ['Sắp hết hàng', stats.lowStock, AlertTriangle],
    ['Chưa phản hồi', stats.unansweredReviews, MessageCircle],
  ]

  return (
    <AdminLayout active="dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-black">Tổng quan</h1>
          <p className="text-sm text-black/50 mt-1">Quản lý nhanh hoạt động của Lý Mập Food.</p>
        </div>
        <Link to="/Admin/Create" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#E0533C] text-white text-xs font-black hover:bg-[#c9432b]">
          <PlusCircle className="w-4 h-4" /> Thêm món
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black/45">{label}</span>
              <Icon className="w-4 h-4 text-[#E0533C]" />
            </div>
            <div className="text-xl font-black mt-3">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <section className="lg:col-span-2 bg-white rounded-xl border border-black/5 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black">Đơn hàng gần đây</h2>
            <Link to="/Admin/Orders" className="text-xs font-bold text-[#E0533C]">Xem tất cả</Link>
          </div>
          {orders.length ? orders.map((o) => (
            <div key={o.orderId} className="flex items-center justify-between gap-3 py-3 border-t border-black/5">
              <div><div className="text-sm font-bold">#{o.orderId}</div><div className="text-[11px] text-black/40">{new Date(o.createdAt).toLocaleString('vi-VN')}</div></div>
              <div className="text-sm font-black">{formatVnd(o.total)}</div>
              <div className="text-[11px] font-bold text-black/50">{o.status}</div>
            </div>
          )) : <p className="text-sm text-black/45 py-5">Chưa có đơn hàng.</p>}
        </section>

        <section className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
          <h2 className="font-black mb-4">Trạng thái cửa hàng</h2>
          <div className="rounded-lg bg-[#FFFBF2] p-4">
            <div className="text-xs text-black/45 font-bold">GIỜ HOẠT ĐỘNG</div>
            <div className="text-lg font-black mt-1">{settings.openTime} — {settings.closeTime}</div>
            <div className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-[11px] font-black ${settings.acceptingOrders ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {settings.acceptingOrders ? 'Đang nhận đơn' : 'Đang tạm ngưng nhận đơn'}
            </div>
          </div>
          <Link to="/Admin/Settings" className="block mt-3 text-xs font-bold text-[#E0533C]">Chỉnh giờ & cài đặt →</Link>
        </section>
      </div>
    </AdminLayout>
  )
}
export default function AdminIndex() {
  return <RequireAdmin><AdminIndexInner /></RequireAdmin>
}
