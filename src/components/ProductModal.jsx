import { formatVnd, getSiteContent } from '../utils/storage'
import { ZALO_PHONE } from '../data/menuData'
import { useShop } from '../context/ShopContext'

export default function ProductModal({ item, products = {}, onClose, onOpenDetail }) {
  const ui = getSiteContent().shopUi || {}
  const { addToCart, isFavorite, toggleFavorite } = useShop()

  if (!item) return null

  const numPrice = typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, '')) || 0 : item.price
  const isOnSale = item.isOnSale && item.discountPercent > 0
  const finalPrice = isOnSale ? (numPrice * (100 - item.discountPercent)) / 100 : numPrice

  const pctP = item.pctProtein || 25
  const pctC = item.pctCarbs || 30
  const pctF = item.pctFat || 15

  const relatedItems = Object.values(products)
    .filter((p) => p.id !== item.id && p.category === item.category)
    .slice(0, 4)

  const zaloMsg = `Chào Lý Mập Food, tôi muốn đặt món: ${item.title} (Giá: ${formatVnd(finalPrice)})`
  const zaloHref = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(zaloMsg)}`

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[2rem] max-w-3xl w-full p-0 shadow-2xl relative border border-slate-100 animate-fade-in-up my-auto overflow-hidden flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100/90 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-slate-200 transition z-50 shadow-sm"
          title="Đóng"
        >
          ✕
        </button>

        <div className="md:w-5/12 relative h-64 md:h-auto bg-slate-50">
          <img src={item.img} className="w-full h-full object-cover" alt="Chi tiết món" />
          <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
            Tươi Mới Mỗi Ngày
          </span>
        </div>

        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col bg-white">
          <div className="pr-10 mb-2 flex items-start justify-between gap-2">
            <h3 className="font-headline font-extrabold text-2xl text-slate-900 leading-tight">{item.title}</h3>
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 ${
                isFavorite(item.id) ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-red-500'
              }`}
              title="Yêu thích món này"
            >
              <span className="material-symbols-outlined text-lg" style={isFavorite(item.id) ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                favorite
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="font-headline font-black text-xl text-primary">
              {isOnSale ? (
                <>
                  <span className="line-through text-slate-400 text-sm mr-2">{formatVnd(numPrice)}</span>
                  <span className="text-red-600">{formatVnd(finalPrice)}</span>
                </>
              ) : (
                formatVnd(numPrice)
              )}
            </div>
            <div className="bg-[#B1F0CE] text-[#0F5238] text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[13px]">health_and_safety</span>
              <span>
                Healthy: <strong>{item.score || '9.5'}</strong>/10
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium mb-6 pb-6 border-b border-slate-100">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> <span>{item.batch || '09:30 AM'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span> <span>{item.sold || '3.500+'}</span> Đã bán
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mb-6">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Calo</div>
              <div className="font-headline font-bold text-sm text-slate-900">{item.calo}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Protein</div>
              <div className="font-headline font-bold text-sm text-slate-900">{item.protein || '5.5g'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Carbs</div>
              <div className="font-headline font-bold text-sm text-slate-900">{item.carbs || '18.0g'}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Fat</div>
              <div className="font-headline font-bold text-sm text-slate-900">{item.fat || '3.5g'}</div>
            </div>
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>% Nhu cầu hằng ngày (2000 kcal)</span>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>Đạm thực vật</span>
                <span className="text-primary font-bold">{pctP}%</span>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${pctP}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000"></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>Tinh bột & Chất xơ</span>
                <span className="text-amber-500 font-bold">{pctC}%</span>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${pctC}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-400 transition-all duration-1000"></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span>Chất béo tốt</span>
                <span className="text-emerald-500 font-bold">{pctF}%</span>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${pctF}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-400 transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 mb-8">
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">🌿</span>
              <span>
                <strong className="text-slate-900 font-semibold">Nguyên Liệu:</strong>{' '}
                {item.ingredients || 'Đậu hạt và nguyên liệu tự nhiên tươi mới tuyển chọn.'}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">💚</span>
              <span>
                <strong className="text-slate-900 font-semibold">Tác Dụng:</strong>{' '}
                {item.benefits || 'Thơm ngon, thanh mát, bổ dưỡng và an toàn cho sức khỏe.'}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary mt-0.5">📦</span>
              <span>
                <strong className="text-slate-900 font-semibold">Bảo Quản:</strong> {item.storageText || 'Ngon nhất trong ngày, bảo quản mát 2-4°C.'}
              </span>
            </p>
          </div>

          {relatedItems.length > 0 && (
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Có Thể Bạn Cũng Thích</div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {relatedItems.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onOpenDetail && onOpenDetail(rel.id)}
                    className="shrink-0 w-24 text-left group/rel"
                  >
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-50 mb-1.5">
                      <img src={rel.img} alt={rel.title} className="w-full h-full object-cover group-hover/rel:scale-105 transition duration-300" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 line-clamp-2 leading-tight">{rel.title}</p>
                    <p className="text-[11px] font-bold text-primary mt-0.5">
                      {formatVnd(typeof rel.price === 'string' ? parseInt(rel.price.replace(/\D/g, '')) || 0 : rel.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2">
            <button
              onClick={() => addToCart(item, finalPrice)}
              className="w-full bg-[#B1F0CE] hover:bg-[#95d4b3] text-[#0F5238] font-bold py-3.5 rounded-full text-center text-[13px] flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              <span>{ui.productAddLabel || ui.addToCart || 'Thêm vào giỏ hàng'}</span>
            </button>
            <a
              href={zaloHref}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-primary hover:bg-primary-container text-white font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 text-center text-[13px] flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-sm text-secondary-container">send</span>
              <span>{ui.productOrderLabel || 'Đặt ngay qua Zalo'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
