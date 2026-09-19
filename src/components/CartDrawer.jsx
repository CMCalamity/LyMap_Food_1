import { useEffect, useState } from 'react'
import { useShop } from '../context/ShopContext'
import { formatVnd, addOrder, getCoupons, getStoreSettings, redeemCoupon } from '../utils/storage'
import { ZALO_PHONE } from '../data/menuData'
import { useStoreStatus } from '../utils/useStoreStatus'
import { getSiteContent } from '../utils/storage'

function genOrderId() {
  return 'DH' + Date.now().toString().slice(-8)
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, clearCart, cartCount, cartTotal } = useShop()
  const [voucherInput, setVoucherInput] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [voucherError, setVoucherError] = useState('')
  const [customer, setCustomer] = useState(() => { try { return JSON.parse(localStorage.getItem('lymap_customer') || '{}') } catch { return {} } })
  const [fulfillment, setFulfillment] = useState('delivery')
  const [note, setNote] = useState('')
  const [schedule, setSchedule] = useState('')
  const [payment, setPayment] = useState('cash')
  const [zoneId, setZoneId] = useState(() => localStorage.getItem('lymap_delivery_zone') || '')
  const settings = getStoreSettings()
  const status = useStoreStatus()
  const ui = getSiteContent().shopUi || {}
  const zones = Array.isArray(settings.deliveryZones) ? settings.deliveryZones : []
  const zone = zones.find(z => z.id === zoneId) || zones[0] || null
  useEffect(() => { if (zone && !zoneId) setZoneId(zone.id) }, [zone, zoneId])
  useEffect(() => { if (zoneId) localStorage.setItem('lymap_delivery_zone', zoneId) }, [zoneId])
  useEffect(() => { localStorage.setItem('lymap_customer', JSON.stringify(customer)) }, [customer])

  if (!cartOpen) return null

  const coupons = getCoupons()
  const discountPercent = appliedVoucher ? Number(coupons.find(v => v.code === appliedVoucher)?.percent || 0) : 0
  const discountAmount = Math.round((cartTotal * discountPercent) / 100)
  const finalTotal = cartTotal - discountAmount

  function handleApplyVoucher() {
    const code = voucherInput.trim().toUpperCase()
    const today = new Date().toISOString().slice(0,10)
    const voucher = coupons.find(v => v.code === code && v.active !== false && (!v.startDate || today >= v.startDate) && (!v.endDate || today <= v.endDate) && (!v.maxUses || Number(v.usedCount||0) < Number(v.maxUses)))
    if (!voucher) {
      setVoucherError('Mã không hợp lệ hoặc đã hết hạn.')
      setAppliedVoucher(null)
      return
    }
    if (voucher.minTotal && cartTotal < voucher.minTotal) {
      setVoucherError(`Đơn cần tối thiểu ${formatVnd(voucher.minTotal)} để dùng mã này.`)
      setAppliedVoucher(null)
      return
    }
    setAppliedVoucher(code)
    setVoucherError('')
  }

  function handleRemoveVoucher() {
    setAppliedVoucher(null)
    setVoucherInput('')
    setVoucherError('')
  }

  function handleCheckout() {
    if (cart.length === 0) return
    if (!status.isOpen) { alert(ui.storeClosedText || 'Cửa hàng hiện đang tạm nghỉ.'); return }
    if (cartTotal < Number(settings.minOrder || 0)) { alert(`Đơn tối thiểu ${formatVnd(settings.minOrder)}.`); return }
    if (!customer.name?.trim() || !customer.phone?.trim()) { alert('Vui lòng nhập tên và số điện thoại để cửa hàng xác nhận đơn.'); return }
    if (fulfillment === 'delivery' && !customer.address?.trim()) { alert('Vui lòng nhập địa chỉ giao hàng.'); return }
    if (fulfillment === 'delivery' && zones.length && !zone) { alert('Vui lòng chọn khu vực giao hàng.'); return }
    localStorage.setItem('lymap_customer', JSON.stringify(customer))

    const orderId = genOrderId()
    const lines = cart.map((item) => `- ${item.title} x${item.qty} (${formatVnd(item.price * item.qty)})`).join('\n')
    const voucherLine = appliedVoucher ? `\nMã giảm giá: ${appliedVoucher} (-${formatVnd(discountAmount)})` : ''
    const deliveryFreeFrom = Number(zone?.freeFrom ?? settings.freeShipFrom ?? 0)
    const deliveryFee = fulfillment === 'delivery' && settings.deliveryEnabled ? (finalTotal >= deliveryFreeFrom ? 0 : Number(zone?.fee ?? settings.deliveryFee ?? 0)) : 0
    const grandTotal = finalTotal + deliveryFee
    const customerLine = `\nKhách: ${customer.name.trim()}\nSĐT: ${customer.phone.trim()}${fulfillment === 'delivery' ? `\nĐịa chỉ: ${customer.address.trim()}` : ''}`
    const deliveryLine = fulfillment === 'delivery' ? `\nHình thức: Giao tận nơi\nPhí giao: ${formatVnd(deliveryFee)}` : '\nHình thức: Nhận tại quán'
    const noteLine = note.trim() ? `\nGhi chú: ${note.trim()}` : ''
    const scheduleLine = schedule ? `\nThời gian mong muốn: ${schedule}` : ''
    const paymentLine = `\nThanh toán: ${payment === 'transfer' ? 'Chuyển khoản' : payment === 'momo' ? 'MoMo' : 'Tiền mặt'}`
    const zaloMsg = `Chào Lý Mập Food, tôi muốn đặt đơn #${orderId}:${customerLine}\n${lines}${voucherLine}${deliveryLine}${paymentLine}${scheduleLine}${noteLine}\nTổng cộng: ${formatVnd(grandTotal)}`
    const zaloHref = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(zaloMsg)}`

    if (appliedVoucher) redeemCoupon(appliedVoucher)

    addOrder({
      orderId,
      items: cart,
      voucher: appliedVoucher,
      discountAmount,
      subtotal: cartTotal,
      deliveryFee,
      total: grandTotal,
      customer: { ...customer, fulfillment, note, schedule, payment, deliveryZone: zone?.name || '' },
      createdAt: new Date().toISOString(),
      status: 'Chờ Xác Nhận',
    })

    window.open(zaloHref, '_blank', 'noreferrer')
    clearCart()
    handleRemoveVoucher()
    setCartOpen(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      <div className="relative w-full max-w-lg h-full bg-surface-container-lowest shadow-2xl flex flex-col animate-fade-in-up visible">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-surface-container-high">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_cart</span>
            {ui.cartTitle || 'Giỏ hàng của bạn'} {cartCount > 0 && <span className="text-xs text-on-surface-variant">({cartCount} món)</span>}
          </h3>
          <button
            onClick={() => setCartOpen(false)}
            className="bg-surface-container-high text-on-surface-variant w-8 h-8 rounded-full flex items-center justify-center hover:bg-tertiary-fixed transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3">
          {cart.length > 0 && !status.isOpen && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800"><div className="font-black">{ui.storeClosedTitle || 'Cửa hàng đang tạm nghỉ'}</div><p className="mt-1 text-[11px] leading-relaxed">{ui.storeClosedText || 'Bạn vẫn có thể chuẩn bị giỏ hàng. Đơn sẽ được nhận khi cửa hàng mở lại.'}</p></div>
          )}
          {cart.length > 0 && (
            <div className="bg-[#FFFBF2] rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between"><div className="text-xs font-black">{ui.customerTitle || 'Thông tin nhận hàng'}</div><span className="text-[10px] text-black/35">Tự lưu</span></div>
              <input value={customer.name || ''} onChange={e=>setCustomer({...customer,name:e.target.value})} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5" placeholder={ui.namePlaceholder || 'Họ và tên *'} />
              <input type="tel" inputMode="tel" value={customer.phone || ''} onChange={e=>setCustomer({...customer,phone:e.target.value})} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5" placeholder={ui.phonePlaceholder || 'Số điện thoại *'} />
              {(settings.deliveryEnabled || settings.pickupEnabled) && <div className="flex gap-2">{settings.deliveryEnabled && <button type="button" onClick={()=>setFulfillment('delivery')} className={`flex-1 rounded-lg py-2 text-[10px] font-black ${fulfillment==='delivery'?'bg-primary text-white':'bg-white text-black/50 border border-black/5'}`}>{ui.deliveryLabel || 'Giao tận nơi'}</button>}{settings.pickupEnabled && <button type="button" onClick={()=>setFulfillment('pickup')} className={`flex-1 rounded-lg py-2 text-[10px] font-black ${fulfillment==='pickup'?'bg-primary text-white':'bg-white text-black/50 border border-black/5'}`}>{ui.pickupLabel || 'Nhận tại quán'}</button>}</div>}
              {fulfillment==='delivery' && settings.deliveryEnabled && <input value={customer.address || ''} onChange={e=>setCustomer({...customer,address:e.target.value})} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5" placeholder={ui.addressPlaceholder || 'Địa chỉ giao hàng *'} />}{fulfillment==='delivery' && settings.deliveryEnabled && zones.length>0 && <label className="block text-[10px] font-bold text-black/45"><span className="block mb-1">Khu vực giao hàng</span><select value={zone?.id||''} onChange={e=>setZoneId(e.target.value)} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5"><option value="" disabled>Chọn khu vực</option>{zones.map(z=><option key={z.id} value={z.id}>{z.name} · {formatVnd(z.fee)}</option>)}</select></label>}
              <div className="grid sm:grid-cols-2 gap-2">
                {settings.allowPreorder && <label className="block text-[10px] font-bold text-black/45"><span className="block mb-1">{ui.preorderLabel || 'Thời gian nhận mong muốn'}</span><input type="datetime-local" value={schedule} onChange={e=>setSchedule(e.target.value)} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5" /></label>}
                <label className="block text-[10px] font-bold text-black/45"><span className="block mb-1">{ui.paymentLabel || 'Thanh toán'}</span><select value={payment} onChange={e=>setPayment(e.target.value)} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5"><option value="cash">Tiền mặt</option>{settings.transferPayment&&<option value="transfer">Chuyển khoản</option>}{settings.momoPayment&&<option value="momo">MoMo</option>}</select></label>
              </div>
              <input value={note} onChange={e=>setNote(e.target.value)} className="w-full bg-white rounded-lg px-3 py-2 text-xs border border-black/5" placeholder={ui.notePlaceholder || 'Ghi chú đơn hàng (không bắt buộc)'} />
            </div>
          )}
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-on-surface-variant py-20">
              <span className="material-symbols-outlined text-5xl text-tertiary-fixed-dim">shopping_cart</span>
              <p className="font-body-md text-body-md">{ui.emptyCart || 'Giỏ hàng đang trống. Hãy chọn vài món ngon nhé!'}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-2xl border border-tertiary-fixed-dim">
                <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-label-bold text-label-bold text-on-surface truncate">{item.title}</p>
                  <p className="text-xs text-primary font-bold mt-0.5">{formatVnd(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-surface-container-high hover:bg-tertiary-fixed text-on-surface-variant font-bold flex items-center justify-center text-xs"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-surface-container-high hover:bg-tertiary-fixed text-on-surface-variant font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-error hover:bg-error-container/50 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  title="Xóa món"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-4 sm:px-5 py-4 border-t border-surface-container-high space-y-3">
            <div className="space-y-2">
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold px-3.5 py-2.5 rounded-xl">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">local_offer</span>
                    Đã áp dụng mã <strong>{appliedVoucher}</strong>
                  </span>
                  <button onClick={handleRemoveVoucher} className="underline hover:no-underline">
                    Gỡ mã
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder={ui.couponPlaceholder || 'Nhập mã giảm giá'}
                      className="flex-1 min-w-0 bg-surface-container-low border border-tertiary-fixed-dim rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      className="shrink-0 bg-surface-container-high hover:bg-tertiary-fixed text-on-surface font-label-bold text-label-bold text-xs px-4 rounded-xl transition"
                    >
                      Áp Dụng
                    </button>
                  </div>
                  {voucherError && <p className="text-error text-[11px] font-semibold mt-1.5">{voucherError}</p>}
                </div>
              )}
            </div>

            <div className="space-y-1 pt-1"><div className="text-[10px] text-black/40 font-semibold">{ui.minOrderHint || 'Đơn tối thiểu'}: {formatVnd(settings.minOrder || 0)}</div>
              <div className="flex justify-between items-center text-xs text-on-surface-variant font-semibold">
                <span>Tạm tính:</span>
                <span>{formatVnd(cartTotal)}</span>
              </div>
              {fulfillment==='delivery' && settings.deliveryEnabled && <div className="flex justify-between items-center text-xs text-on-surface-variant font-semibold"><span>Phí giao hàng:</span><span>{finalTotal >= Number(settings.freeShipFrom || 0) ? 'Miễn phí' : formatVnd(zone?.fee ?? settings.deliveryFee)}</span></div>}
              {appliedVoucher && (
                <div className="flex justify-between items-center text-xs text-red-600 font-semibold">
                  <span>Giảm giá ({discountPercent}%):</span>
                  <span>−{formatVnd(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-on-surface-variant">Tổng cộng:</span>
                <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(finalTotal + (fulfillment === 'delivery' && settings.deliveryEnabled && finalTotal < Number(zone?.freeFrom ?? settings.freeShipFrom ?? 0) ? Number(settings.deliveryFee || 0) : 0))}</span>
              </div>
            </div>

            <button
              disabled={!status.isOpen}
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-45 disabled:cursor-not-allowed text-on-primary font-label-bold text-label-bold py-4 rounded-full shadow-[0_8px_24px_0_rgba(45,106,79,0.2)] transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base text-secondary-container">send</span>
              <span>{ui.checkoutButton || 'Gửi đơn qua Zalo'}</span>
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs font-bold text-on-surface-variant hover:text-error transition py-1"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
