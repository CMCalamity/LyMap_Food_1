import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import RequireAdmin from '../../components/admin/RequireAdmin'
import { getOrders, updateOrderStatus, formatVnd } from '../../utils/storage'

const STATUS_OPTIONS = ['Chờ Xác Nhận', 'Đang Chuẩn Bị', 'Đang Giao', 'Hoàn Tất', 'Đã Hủy']

const STATUS_STYLES = {
  'Chờ Xác Nhận': 'bg-amber-100 text-amber-800',
  'Đang Chuẩn Bị': 'bg-blue-100 text-blue-800',
  'Đang Giao': 'bg-indigo-100 text-indigo-800',
  'Hoàn Tất': 'bg-emerald-100 text-emerald-800',
  'Đã Hủy': 'bg-red-100 text-red-800',
}

function AdminOrdersInner() {
  const [orders, setOrders] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Tất cả')

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const visibleOrders = useMemo(() => orders.filter(o => { const hay = `${o.orderId} ${o.customer?.name || ''} ${o.customer?.phone || ''}`.toLowerCase(); return (filter === 'Tất cả' || o.status === filter) && hay.includes(q.toLowerCase()) }), [orders, q, filter])

  function handleStatusChange(orderId, status) {
    const next = updateOrderStatus(orderId, status)
    setOrders(next)
  }

  return (
    <AdminLayout active="orders">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">DANH SÁCH ĐƠN HÀNG</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Đồng bộ trực tiếp từ giỏ hàng khách đặt trên trang chủ
          </p>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl">{orders.length} đơn</span>
      </div>

      <div className="bg-white rounded-xl border border-black/5 p-3 flex flex-wrap gap-2"><input value={q} onChange={e=>setQ(e.target.value)} className="admin-field flex-1 min-w-[220px] bg-[#FFFBF2] rounded-lg px-3 py-2 text-xs" placeholder="Tìm mã đơn, tên, số điện thoại..."/><select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-[#FFFBF2] rounded-lg px-3 py-2 text-xs border-0"><option>Tất cả</option>{STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}</select></div>

      {visibleOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm text-center text-sm text-slate-500 font-semibold">
          Chưa có đơn hàng nào. Đơn sẽ tự động xuất hiện ở đây khi khách bấm "Gửi Đơn Qua Zalo" từ giỏ hàng.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                <div>
                  <span className="font-black text-slate-900">Đơn #{order.orderId}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleString('vi-VN')} • Tổng: {formatVnd(order.total)}
                    {order.voucher && (
                      <span className="ml-1 text-emerald-600 font-semibold">
                        (đã áp mã {order.voucher}, giảm {formatVnd(order.discountAmount || 0)})
                      </span>
                    )}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-700'}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {order.customer && <div className="bg-[#FFFBF2] rounded-lg p-3 text-xs space-y-1"><div className="font-black">{order.customer.name} · {order.customer.phone}</div><div className="text-slate-500">{order.customer.fulfillment==='pickup'?'Nhận tại quán':'Giao tận nơi'}{order.customer.payment?` · ${order.customer.payment==='transfer'?'Chuyển khoản':order.customer.payment==='momo'?'MoMo':'Tiền mặt'}`:''}</div>{order.customer.address && <div className="text-slate-500">{order.customer.address}</div>}{order.customer.schedule && <div className="text-slate-500">Thời gian mong muốn: {order.customer.schedule}</div>}{order.customer.note && <div className="font-semibold text-[#E0533C]">Ghi chú: {order.customer.note}</div>}</div>}
              <ul className="text-sm text-slate-600 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.title} <span className="text-slate-400">x{item.qty}</span>
                    </span>
                    <span className="font-semibold text-slate-800">{formatVnd(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export default function AdminOrders() {
  return (
    <RequireAdmin>
      <AdminOrdersInner />
    </RequireAdmin>
  )
}
