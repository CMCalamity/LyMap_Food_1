import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { getSiteContent, getStoreSettings } from '../utils/storage'
import { useStoreStatus } from '../utils/useStoreStatus'
import { isAdminLoggedIn } from '../utils/adminAuth'

export default function Header({ onSearch }) {
  const adminLoggedIn = isAdminLoggedIn()
  const [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState(''), [content, setContent] = useState(getSiteContent), [settings, setSettings] = useState(getStoreSettings)
  const { cartCount, setCartOpen, favorites } = useShop()
  const status = useStoreStatus()
  useEffect(() => { const refresh=()=>{setContent(getSiteContent());setSettings(getStoreSettings())}; refresh(); window.addEventListener('lymap-content',refresh); window.addEventListener('lymap-store-settings',refresh); return()=>{window.removeEventListener('lymap-content',refresh);window.removeEventListener('lymap-store-settings',refresh)} }, [])
  function openFavorites(){window.dispatchEvent(new CustomEvent('lymap:show-favorites'));document.getElementById('menu')?.scrollIntoView({behavior:'smooth'})}
  return <header className="bg-background/90 backdrop-blur-md fixed top-[36px] w-full z-40 border-b border-surface-container-high">
    <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-unit w-full max-w-container-max mx-auto h-[72px]">
      <a className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-2" href="#hero"><div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center text-lg font-bold shadow-md shadow-primary/20">{content.logoText||'LM'}</div><span>{content.brandName||'Lý Mập Food'}</span></a>
      <div className="hidden md:flex gap-5 items-center font-body-md text-body-md">{(content.nav||[]).filter(n=>n.enabled!==false).map(n=><a key={n.href+n.label} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href={n.href}>{n.label}</a>)}</div>
      <div className="flex items-center gap-2">
        <span className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold ${status.isOpen?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}><span className={`w-1.5 h-1.5 rounded-full ${status.isOpen?'bg-emerald-500':'bg-amber-500'}`}/>{status.statusLabel}</span><button onClick={()=>setSearchOpen(v=>!v)} className="text-primary p-2 rounded-full hover:bg-surface-container-high transition" title="Tìm kiếm"><span className="material-symbols-outlined text-2xl">search</span></button>
        <button onClick={openFavorites} className="relative text-primary p-2 rounded-full hover:bg-surface-container-high transition hidden sm:flex" title="Yêu thích"><span className="material-symbols-outlined text-2xl">favorite</span>{favorites.length>0&&<span className="absolute -top-0.5 -right-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>}</button>
        <button onClick={()=>setCartOpen(true)} className="relative text-primary p-2 rounded-full hover:bg-surface-container-high transition" title="Giỏ hàng"><span className="material-symbols-outlined text-2xl">shopping_cart</span>{cartCount>0&&<span className="absolute -top-0.5 -right-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}</button>
        <Link to={adminLoggedIn ? '/Admin/Index' : '/Admin/Login'} className="hidden sm:flex text-xs font-bold px-3 py-2 rounded-full bg-surface-container-high text-slate-700">{adminLoggedIn ? 'Vào quản trị' : (content.shopUi?.headerAdminLabel || 'Admin')}</Link>
        <a href={settings.zaloLink||`https://zalo.me/${settings.contactPhone||'0862299479'}`} target="_blank" rel="noreferrer" className="bg-primary text-on-primary font-label-bold text-label-bold px-4 sm:px-6 py-3 rounded-full flex items-center gap-1.5"><span className="material-symbols-outlined text-base">chat</span><span className="hidden sm:inline">{content.shopUi?.headerOrderLabel || 'Đặt món Zalo'}</span></a>
      </div>
    </nav>
    {searchOpen&&<div className="bg-white border-b border-surface-container-high px-4 py-3 shadow-md"><div className="max-w-xl mx-auto relative"><span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5">search</span><input autoFocus value={query} onChange={e=>{setQuery(e.target.value);onSearch?.(e.target.value)}} placeholder={content.shopUi?.searchPlaceholder || 'Tìm món theo tên hoặc danh mục...'} className="w-full bg-surface-container-low pl-10 pr-10 py-2.5 rounded-full text-xs font-medium border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary"/><button onClick={()=>setSearchOpen(false)} className="absolute right-3 top-2.5 text-slate-400">✕</button></div></div>}
  </header>
}
