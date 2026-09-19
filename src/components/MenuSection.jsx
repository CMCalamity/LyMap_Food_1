import { useEffect, useMemo, useState } from 'react'
import { Heart, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { getSiteContent } from '../utils/storage'
import { useShop } from '../context/ShopContext'

const norm = (v='') => String(v).trim().toLowerCase()
const money = n => new Intl.NumberFormat('vi-VN').format(Math.round(Number(n)||0)) + 'đ'

export default function MenuSection({ products, searchQuery='', onOpenDetail }) {
  const { addToCart } = useShop()
  const [content,setContent]=useState(getSiteContent)
  const [category,setCategory]=useState('Tất Cả')
  const [sort,setSort]=useState('default')
  const [favorites,setFavorites]=useState(()=>JSON.parse(localStorage.getItem('lymap_favorites')||'[]'))
  useEffect(()=>{const r=()=>setContent(getSiteContent());r();window.addEventListener('lymap-content',r);return()=>window.removeEventListener('lymap-content',r)},[])
  useEffect(()=>localStorage.setItem('lymap_favorites',JSON.stringify(favorites)),[favorites])
  const ui=content.shopUi||{}
  const list=Object.values(products||{})
  const cats=useMemo(()=>['Tất Cả',...Array.from(new Set(list.map(x=>x.category).filter(Boolean)))],[list])
  const visible=useMemo(()=>{
    let a=list.filter(x=>category==='Tất Cả'||norm(x.category)===norm(category))
    const q=norm(searchQuery); if(q)a=a.filter(x=>norm(`${x.title} ${x.desc} ${x.category}`).includes(q))
    const price=x=>{const p=Number(String(x.price).replace(/\D/g,''))||0;return x.isOnSale&&x.discountPercent?p*(100-x.discountPercent)/100:p}
    if(sort==='price-asc')a.sort((x,y)=>price(x)-price(y)); if(sort==='price-desc')a.sort((x,y)=>price(y)-price(x)); if(sort==='bestseller')a.sort((x,y)=>(Number(y.sold)||0)-(Number(x.sold)||0))
    return a
  },[list,category,searchQuery,sort])
  const toggleFav=id=>setFavorites(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id])
  return <section id="menu" className="px-margin-mobile md:px-margin-desktop py-16 md:py-24">
    <div className="max-w-container-max mx-auto">
      <div className="grid md:grid-cols-[1fr_auto] gap-5 items-end mb-8 border-b border-surface-container-high pb-7">
        <div><div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[.22em]"><span className="w-8 h-px bg-primary"/>{content.menu?.eyebrow||'Thực Đơn Bình Dân'}</div><h2 className="font-headline-md text-headline-md text-primary mt-2 max-w-2xl">{content.menu?.title||'DANH MỤC MÓN NGON'}</h2><p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">{content.menu?.description||'Chọn món theo gu, xem nhanh thông tin rồi thêm thẳng vào giỏ.'}</p></div>
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant"><Search className="w-4 h-4 text-primary"/><span>{visible.length} món đang có</span></div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-8">
        <div className="flex gap-1.5 overflow-x-auto pb-1">{cats.map((cat,i)=><button key={cat} onClick={()=>setCategory(cat)} className={`shrink-0 px-4 py-2.5 rounded-full text-[11px] font-black border transition ${category===cat?'bg-primary text-on-primary border-primary':'bg-surface-container-lowest text-on-surface-variant border-tertiary-fixed-dim hover:border-primary'}`}>{cat}</button>)}</div>
        <label className="flex items-center gap-2 text-xs font-bold shrink-0"><SlidersHorizontal className="w-4 h-4 text-primary"/><select value={sort} onChange={e=>setSort(e.target.value)} className="bg-transparent border-0 outline-none font-bold"><option value="default">Mặc định</option><option value="bestseller">Bán chạy</option><option value="price-asc">Giá thấp → cao</option><option value="price-desc">Giá cao → thấp</option></select></label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-7">
        {visible.map((item,i)=>{const p=Number(String(item.price).replace(/\D/g,''))||0;const sale=item.isOnSale&&item.discountPercent>0;const final=sale?p*(100-item.discountPercent)/100:p;return <article key={item.id} className="group relative cursor-pointer" onClick={()=>onOpenDetail(item.id)}>
          <div className={`relative overflow-hidden rounded-[28px] bg-surface-container-low ${i%4===0?'aspect-[1.15]':'aspect-[1.25]'}`}><img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]"/><div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent"/>
            <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between gap-2 text-white"><div><div className="text-[9px] font-black uppercase tracking-widest opacity-80">{item.category}</div><h3 className="text-lg font-black leading-tight">{item.title}</h3></div><span className="font-black text-sm whitespace-nowrap">{money(final)}</span></div>
            {sale&&<span className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1.5 rounded-full text-[9px] font-black">{item.saleNote||`SALE ${item.discountPercent}%`}</span>}
            <button onClick={e=>{e.stopPropagation();toggleFav(item.id)}} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><Heart className={`w-4 h-4 ${favorites.includes(item.id)?'fill-current text-primary':'text-on-surface-variant'}`}/></button>
          </div>
          <div className="px-1 pt-3 flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap gap-1.5 mb-1">{(item.badges||[]).slice(0,2).map(b=><span key={b} className="text-[9px] font-black text-primary bg-primary-fixed px-2 py-1 rounded-full">{b}</span>)}</div><p className="text-xs text-on-surface-variant line-clamp-2 leading-5">{item.desc||'Thơm ngon, đậm vị tự nhiên.'}</p></div><button onClick={e=>{e.stopPropagation();addToCart(item,final)}} className="shrink-0 w-9 h-9 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition"><Plus className="w-4 h-4"/></button></div>
        </article>})}
      </div>
    </div>
  </section>
}
