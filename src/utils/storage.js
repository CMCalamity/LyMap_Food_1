import { DEFAULT_MENU, DEFAULT_PRODUCTS } from '../data/menuData'

export function normalizeCategory(cat) {
  if (!cat) return 'Khác'
  const c = cat.trim().toLowerCase()
  if (c === 'sua' || c === 'sữa tươi') return 'Sữa Tươi'
  if (c === 'comchay' || c === 'cơm cháy') return 'Cơm Cháy'
  if (c === 'topping') return 'Topping'
  return cat.trim()
}

export function loadSyncedMenu() {
  const saved = localStorage.getItem('lymap_products')
  if (saved) {
    const adminList = JSON.parse(saved)
    const merged = {}
    adminList.forEach((item) => {
      const fallback = DEFAULT_MENU[item.id] || {}
      merged[item.id] = { ...fallback, ...item }
    })
    return merged
  }
  const adminInitial = Object.values(DEFAULT_MENU).map((p) => ({
    ...p, status: 'Đang Bán', isAvailable: true,
  }))
  localStorage.setItem('lymap_products', JSON.stringify(adminInitial))
  return { ...DEFAULT_MENU }
}

export function getAdminProducts() {
  const data = localStorage.getItem('lymap_products')
  if (!data) {
    localStorage.setItem('lymap_products', JSON.stringify(DEFAULT_PRODUCTS.map((p) => ({ ...p, isAvailable: true }))))
    return DEFAULT_PRODUCTS.map((p) => ({ ...p, isAvailable: true }))
  }
  return JSON.parse(data)
}

export function saveAdminProducts(products) {
  localStorage.setItem('lymap_products', JSON.stringify(products))
  window.dispatchEvent(new Event('lymap-products'))
}

export function updateAdminProduct(id, patch) {
  const next = getAdminProducts().map((p) => p.id === id ? { ...p, ...patch } : p)
  saveAdminProducts(next)
  return next.find((p) => p.id === id)
}



export const MIX_SETTINGS_KEY = 'lymap_mix_settings'
export const DEFAULT_MIX_SETTINGS = {
  enabled: true,
  title: 'TỰ MIX LY SỮA & TÍNH CALO',
  eyebrow: 'Cá Nhân Hóa Ly Sữa', subtitle: 'Tự chọn vị sữa, mức đường và topping theo ý thích!',
  bases: [
    { id: 'base-soy', name: 'Sữa Đậu Nành', calo: 120, price: 10000, enabled: true },
    { id: 'base-corn', name: 'Sữa Bắp Tươi', calo: 160, price: 15000, enabled: true },
    { id: 'base-red-bean', name: 'Sữa Đậu Đỏ', calo: 140, price: 15000, enabled: true },
  ],
  sugars: [
    { id: 'sugar-100', value: '100% Chuẩn vị', label: '100% Chuẩn Vị', calo: 0, price: 0, enabled: true },
    { id: 'sugar-50', value: '50% Ngọt nhẹ', label: '50% Ít Ngọt', calo: 0, price: 0, enabled: true },
    { id: 'sugar-0', value: '0% Không đường', label: '0% Không Đường', calo: 0, price: 0, enabled: true },
  ],
  toppings: [
    { id: 'top-pearl', name: 'Trân châu đen', label: 'Trân Châu', calo: 70, price: 5000, enabled: true },
    { id: 'top-jelly', name: 'Thạch lá nếp', label: 'Thạch Lá Nếp', calo: 30, price: 5000, enabled: true },
    { id: 'top-grass-jelly', name: 'Sương sáo', label: 'Sương Sáo', calo: 20, price: 5000, enabled: true },
  ],
}

function cloneMixDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_MIX_SETTINGS))
}

export function getMixSettings() {
  try {
    const raw = localStorage.getItem(MIX_SETTINGS_KEY)
    if (!raw) {
      const defaults = cloneMixDefaults()
      localStorage.setItem(MIX_SETTINGS_KEY, JSON.stringify(defaults))
      return defaults
    }
    const saved = JSON.parse(raw)
    return {
      ...cloneMixDefaults(),
      ...saved,
      bases: Array.isArray(saved.bases) ? saved.bases : cloneMixDefaults().bases,
      sugars: Array.isArray(saved.sugars) ? saved.sugars : cloneMixDefaults().sugars,
      toppings: Array.isArray(saved.toppings) ? saved.toppings : cloneMixDefaults().toppings,
    }
  } catch {
    return cloneMixDefaults()
  }
}

export function saveMixSettings(settings) {
  const next = { ...getMixSettings(), ...settings }
  localStorage.setItem(MIX_SETTINGS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('lymap-mix-settings'))
  return next
}

export function formatVnd(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + ' ₫'
}

export const STORE_SETTINGS_KEY = 'lymap_store_settings'
export const DEFAULT_STORE_SETTINGS = {
  storeName: 'Lý Mập Food', openTime: '06:00', closeTime: '21:30',
  batchTimes: ['06:00', '08:30', '11:00', '14:00', '16:30', '19:00'],
  acceptingOrders: true, pickupEnabled: true, announcement: 'Sữa mới nấu mỗi ngày', contactPhone: '', zaloLink: '',
  deliveryEnabled: true, deliveryFee: 15000, freeShipFrom: 150000, minOrder: 30000,
  prepTime: '15–30 phút', allowPreorder: true, cashPayment: true, transferPayment: true,
  momoPayment: false, deliveryRadius: 5, deliveryZones: [{id:'zone-1',name:'Khu vực gần',fee:15000,freeFrom:150000},{id:'zone-2',name:'Khu vực xa',fee:25000,freeFrom:200000}], address: 'Biên Hòa, Đồng Nai',
  weeklyHours: {
    mon: { enabled: true, open: '06:00', close: '21:30' }, tue: { enabled: true, open: '06:00', close: '21:30' },
    wed: { enabled: true, open: '06:00', close: '21:30' }, thu: { enabled: true, open: '06:00', close: '21:30' },
    fri: { enabled: true, open: '06:00', close: '21:30' }, sat: { enabled: true, open: '06:00', close: '21:30' },
    sun: { enabled: true, open: '06:00', close: '21:30' },
  },
}

export function getStoreSettings() {
  try {
    const raw = localStorage.getItem(STORE_SETTINGS_KEY)
    const saved = raw ? JSON.parse(raw) : {}
    return { ...DEFAULT_STORE_SETTINGS, ...saved, weeklyHours: { ...DEFAULT_STORE_SETTINGS.weeklyHours, ...(saved.weeklyHours || {}) } }
  } catch { return { ...DEFAULT_STORE_SETTINGS } }
}

export function saveStoreSettings(settings) {
  const next = { ...getStoreSettings(), ...settings }
  localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('lymap-store-settings'))
  return next
}

export function getDashboardStats() {
  const products = getAdminProducts(), orders = getOrders(), reviews = getReviews(), coupons = getCoupons()
  const revenue = orders.filter((o) => o.status !== 'Đã Hủy').reduce((sum, o) => sum + Number(o.total || 0), 0)
  return { products: products.length, activeProducts: products.filter((p) => p.status !== 'Ngừng Bán' && p.isAvailable !== false).length, orders: orders.length, pendingOrders: orders.filter((o) => o.status === 'Chờ Xác Nhận').length, revenue, reviews: reviews.length, unansweredReviews: reviews.filter(r => !r.adminReply).length, lowStock: products.filter(p => Number(p.stock ?? 50) <= Number(p.lowStockThreshold ?? 10)).length, coupons: coupons.filter(c => c.active).length }
}

const ORDERS_KEY = 'lymap_orders'
export function getOrders() { return readJsonList(ORDERS_KEY) }
export function addOrder(order) {
  const orders = getOrders(), next = [order, ...orders]
  localStorage.setItem(ORDERS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('lymap-orders')); return next
}
export function updateOrderStatus(orderId, status) {
  const next = getOrders().map((o) => (o.orderId === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
  localStorage.setItem(ORDERS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('lymap-orders')); return next
}

const REVIEWS_KEY = 'lymap_reviews'
export function getReviews(seed = []) {
  const raw = localStorage.getItem(REVIEWS_KEY)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(seed)); return seed
}
export function addReview(review, seed = []) {
  const next = [review, ...getReviews(seed)]
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('lymap-reviews')); return next
}
export function replyToReview(reviewId, reply) {
  const next = getReviews().map((r, i) => (String(r.id ?? i) === String(reviewId) ? { ...r, adminReply: reply, repliedAt: new Date().toISOString() } : r))
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('lymap-reviews')); return next
}
export function updateReview(reviewId, patch) {
  const next = getReviews().map((r, i) => (String(r.id ?? i) === String(reviewId) ? { ...r, ...patch } : r))
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(next)); window.dispatchEvent(new Event('lymap-reviews')); return next
}

const COUPONS_KEY = 'lymap_coupons'
export const DEFAULT_COUPONS = [
  { id: 1, code: 'LYMAP10', percent: 10, minTotal: 0, active: true, note: 'Giảm 10% tổng hóa đơn' },
  { id: 2, code: 'LYMAP20', percent: 20, minTotal: 50000, active: true, note: 'Giảm 20% cho đơn từ 50.000đ' },
]
export function getCoupons() { return readJsonList(COUPONS_KEY).length ? readJsonList(COUPONS_KEY) : DEFAULT_COUPONS }
export function saveCoupons(coupons) { localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons)); window.dispatchEvent(new Event('lymap-coupons')); return coupons }
export function redeemCoupon(code) { const list=getCoupons(); const next=list.map(c=>c.code===code?{...c,usedCount:Number(c.usedCount||0)+1}:c); saveCoupons(next); return next.find(c=>c.code===code) }

const CONTENT_KEY = 'lymap_site_content'

export const DEFAULT_SITE_CONTENT = {
  brandName: 'Lý Mập Food',
  brandTagline: 'Freshness in Motion.',
  logoText: 'LM',
  nav: [
    { label: 'Trang Chủ', href: '#hero', enabled: true },
    { label: 'Câu Chuyện', href: '#story', enabled: true },
    { label: 'Bảo Chứng', href: '#highlights', enabled: true },
    { label: 'Thực Đơn', href: '#menu', enabled: true },
    { label: 'Tự Mix Calo', href: '#calculator', enabled: true },
    { label: 'Hỏi Đáp', href: '#faq', enabled: true },
    { label: 'Liên Hệ', href: '#contact', enabled: true },
  ],
  hero: {
    badge: '100% ĐẬU NÀNH TƯƠI • GIÁ TỪ 10.000Đ',
    title: 'Sữa Đậu Nành & Sữa Bắp',
    subtitle: 'Đậm Vị Mới Nấu.',
    description: 'Thưởng thức hương vị béo ngậy nguyên bản từ hạt đậu nành chọn lọc và bắp ngọt tươi. Nấu mới mỗi ngày, đóng chai tươi và giao tận tay.',
    promiseTitle: 'Cam Kết Giữ Trọn Độ Giòn & Nóng',
    promiseText: 'Trong bán kính giao hàng, cơm cháy giữ độ giòn và sữa tươi giữ trọn hương vị mới nấu.',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=700&q=80',
    primaryCta: 'Khám Phá Thực Đơn',
    secondaryCta: 'Câu Chuyện Của Quán',
  },
  story: {
    eyebrow: 'Câu Chuyện Của Chúng Tôi',
    title: 'Khởi Nguồn Từ Tình Yêu Vị Sữa Hạt Mộc Mạc',
    text: 'Lý Mập Food bắt đầu từ một xe đẩy sữa hạt nhỏ với mong muốn mang những ly sữa đậu nành, sữa bắp nấu thủ công nguyên chất đến mọi gia đình.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    badge: 'Nấu Thủ Công Từ Tâm',
    cards: [
      { title: 'Tươi Mới 100%', text: 'Nấu theo từng mẻ nhỏ trong ngày để giữ trọn vị thơm béo.' },
      { title: 'Thân Thiện & Bình Dân', text: 'Mức giá dễ tiếp cận, phục vụ nhanh chóng và nhiệt tình.' },
    ],
  },
  highlights: {
    title: 'Lời Hứa Người Bạn Khỏe Mạnh',
    cards: [
      { icon: 'eco', title: 'Từ Nông Trại Đến Chai Sữa', text: 'Nguyên liệu được tuyển chọn kỹ, ưu tiên sự tươi mới và nguồn gốc rõ ràng.', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80' },
      { icon: 'bolt', title: 'Năng Lượng Thuần Khiết', text: 'Hương vị nhẹ nhàng, dễ uống cho một ngày năng động.' },
      { icon: 'favorite', title: 'Không Chất Phụ Gia', text: 'Nấu mới và ưu tiên nguyên liệu tự nhiên trong từng mẻ.' },
      { icon: 'groups', title: 'Khách Hàng Tin Chọn', text: 'Phục vụ mỗi ngày với tiêu chí ngon, sạch và tử tế.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  gallery: {
    eyebrow: 'Bộ Sưu Tập Hình Ảnh',
    title: 'HƯƠNG VỊ VÀ NGUYÊN LIỆU THỰC TẾ',
    images: [
      { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', alt: 'Sữa bắp tươi' },
      { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', alt: 'Cơm cháy giòn' },
      { src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', alt: 'Sữa đậu đỏ' },
      { src: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', alt: 'Nguyên liệu tươi' },
    ],
  },
  menu: { eyebrow: 'Thực Đơn Bình Dân', title: 'DANH MỤC MÓN NGON', description: 'Bấm vào từng món để xem thông tin dinh dưỡng, thành phần và cách bảo quản.' },
  shopUi: {
    searchPlaceholder: 'Tìm món theo tên hoặc danh mục...', headerAdminLabel: 'Admin', headerOrderLabel: 'Đặt món Zalo',
    allCategory: 'Tất Cả', favoritesCategory: 'Yêu Thích', addToCart: 'Thêm vào giỏ', detailCta: 'Xem chi tiết', productAddLabel: 'Thêm vào giỏ', productOrderLabel: 'Đặt ngay qua Zalo',
    sortLabel: 'Sắp xếp', sortDefault: 'Mặc định', sortBest: 'Bán chạy nhất', sortLow: 'Giá thấp đến cao', sortHigh: 'Giá cao đến thấp',
    cartTitle: 'Giỏ hàng của bạn', customerTitle: 'Thông tin nhận hàng', deliveryLabel: 'Giao tận nơi', pickupLabel: 'Nhận tại quán',
    namePlaceholder: 'Họ và tên *', phonePlaceholder: 'Số điện thoại *', addressPlaceholder: 'Địa chỉ giao hàng *',
    preorderLabel: 'Thời gian nhận mong muốn', notePlaceholder: 'Ghi chú đơn hàng (không bắt buộc)', paymentLabel: 'Thanh toán',
    couponPlaceholder: 'Nhập mã giảm giá', couponButton: 'Áp dụng', checkoutButton: 'Gửi đơn qua Zalo', clearCart: 'Xóa toàn bộ giỏ hàng',
    emptyCart: 'Giỏ hàng đang trống. Hãy chọn vài món ngon nhé!', minOrderHint: 'Đơn tối thiểu', deliveryHint: 'Phí giao hàng',
    storeClosedTitle: 'Cửa hàng đang tạm nghỉ', storeClosedText: 'Bạn vẫn có thể xem menu và chuẩn bị giỏ hàng. Đơn sẽ được nhận khi cửa hàng mở lại.'
  },
  calculator: { enabled: true, eyebrow: 'Cá Nhân Hóa Ly Sữa', title: 'TỰ MIX LY SỮA & TÍNH CALO', subtitle: 'Tự chọn vị sữa, mức đường và topping theo ý thích!' },
  faq: {
    eyebrow: 'Giải Đáp Thắc Mắc', title: 'CÂU HỎI THƯỜNG GẶP',
    items: [
      { question: 'Lý Mập Food giao hàng trong bán kính bao xa?', answer: 'Trong bán kính giao hàng do cửa hàng cài đặt, tụi mình ưu tiên giao nhanh để giữ trọn độ ngon.' },
      { question: 'Sữa và cơm cháy bảo quản được bao lâu?', answer: 'Sữa ngon nhất khi dùng trong ngày, bảo quản mát. Cơm cháy nên để nơi khô ráo để giữ độ giòn.' },
      { question: 'Có thể đặt số lượng lớn cho sự kiện, văn phòng không?', answer: 'Có. Bạn có thể gửi đơn qua Zalo để cửa hàng tư vấn số lượng, giá và thời gian chuẩn bị.' },
      { question: 'Thanh toán bằng hình thức nào?', answer: 'Cửa hàng có thể nhận tiền mặt, chuyển khoản hoặc các phương thức được bật trong phần Cửa hàng.' },
      { question: 'Món có thể tự điều chỉnh độ ngọt, topping không?', answer: 'Có. Dùng công cụ Tự Mix để chọn nền sữa, mức đường và topping rồi gửi công thức đặt hàng.' },
    ],
  },
  contact: {
    eyebrow: 'Địa Chỉ & Hotline', title: 'HỆ THỐNG LÝ MẬP FOOD',
    addressLabel: 'Khu vực phục vụ', address: 'Biên Hòa, Đồng Nai',
    hoursLabel: 'Thời gian mở bán', hours: '06:00 - 21:30',
    phoneLabel: 'Hotline / Zalo Đặt Hàng', phoneText: '0862299479',
    facebookLabel: 'Ghé Thăm Fanpage Facebook', facebookUrl: 'https://facebook.com/lymapfood.dongkhoi',
    reviewTitle: 'GỬI GÓP Ý & ĐÁNH GIÁ CHẤT LƯỢNG', reviewDescription: 'Ý kiến của bạn giúp cửa hàng hoàn thiện chất lượng và dịch vụ tốt hơn mỗi ngày!', reviewButton: 'GỬI PHẢN HỒI',
  },
  footer: { description: 'Hệ thống sữa hạt và món ăn vặt tươi mới, phục vụ nhanh chóng mỗi ngày.', copyright: '© 2026 Lý Mập Food. Freshness in Motion.' },
  floatingCall: { enabled: true, label: 'Gọi Ngay' },
  sections: { hero: true, story: true, highlights: true, gallery: true, menu: true, calculator: true, combos: true, faq: true, contact: true },
  seo: { title: 'Lý Mập Food — Sữa tươi nấu mỗi ngày', description: 'Sữa hạt, cơm cháy và Tự Mix tại Lý Mập Food.' },
  heroTitle: 'Sữa tươi nấu mỗi ngày',
  heroSubtitle: 'Ngon lành, thật chất, giao tận tay.',
  announcement: 'Sữa mới nấu mỗi ngày', bannerEnabled: true, bannerText: 'Đặt sớm hôm nay – nhận mẻ mới trong ngày.', promo: {enabled:true,eyebrow:'Ưu đãi hôm nay',title:'Mua 2 chai - tiết kiệm hơn',text:'Kết hợp món yêu thích thành combo để nhận giá tốt hơn.',cta:'Xem combo',badge:'HOT'},
}

function deepMerge(base, saved) {
  if (!saved || typeof saved !== 'object') return base
  const result = Array.isArray(base) ? [...base] : { ...base }
  Object.keys(saved).forEach((key) => {
    const value = saved[key]
    if (value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) result[key] = deepMerge(result[key], value)
    else result[key] = value
  })
  return result
}

export function getSiteContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONTENT_KEY) || 'null')
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)), saved || {})
  } catch { return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) }
}

export function saveSiteContent(content) {
  const next = deepMerge(getSiteContent(), content)
  localStorage.setItem(CONTENT_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('lymap-content'))
  return next
}

function readJsonList(key) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : [] } catch { return [] } }
