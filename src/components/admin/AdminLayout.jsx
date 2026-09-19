import {Link,useLocation,useNavigate} from 'react-router-dom'
import { isAdminLoggedIn, logoutAdmin } from '../../utils/adminAuth'
import {LayoutDashboard,Package,ShoppingCart,Star,Settings,TicketPercent,Users,Boxes,BarChart3,Megaphone,SlidersHorizontal,LogOut,Store,ChevronRight} from 'lucide-react'

const NAV=[
 {key:'dashboard',to:'/Admin/Index',label:'Tổng quan',icon:LayoutDashboard},
 {key:'products',to:'/Admin/Products',label:'Thực đơn',icon:Package},
 {key:'orders',to:'/Admin/Orders',label:'Đơn hàng',icon:ShoppingCart},
 {key:'inventory',to:'/Admin/Inventory',label:'Tồn kho',icon:Boxes},
 {key:'customers',to:'/Admin/Customers',label:'Khách hàng',icon:Users},
 {key:'reviews',to:'/Admin/Reviews',label:'Đánh giá',icon:Star},
 {key:'promotions',to:'/Admin/Promotions',label:'Khuyến mãi',icon:TicketPercent},
 {key:'content',to:'/Admin/Content',label:'Website',icon:Megaphone},
 {key:'mix',to:'/Admin/Mix',label:'Tự Mix',icon:SlidersHorizontal},
 {key:'combos',to:'/Admin/Combos',label:'Combo',icon:Package},
 {key:'reports',to:'/Admin/Reports',label:'Báo cáo',icon:BarChart3},
 {key:'settings',to:'/Admin/Settings',label:'Cửa hàng',icon:Settings},
]

export default function AdminLayout({active,children}){
  const nav=useNavigate(),loc=useLocation(),current=active||NAV.find(x=>loc.pathname===x.to)?.key
  function logout(){logoutAdmin();nav('/Admin/Login',{replace:true})}
  return <div className="min-h-screen bg-[#FFFBF2] text-[#2D2A26] font-['Plus_Jakarta_Sans']">
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[214px] z-50 bg-white border-r border-black/[.07] flex-col">
      <Link to="/Admin/Index" className="h-[72px] px-5 flex items-center gap-3 border-b border-black/[.06] shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#E0533C] text-white font-black text-xs flex items-center justify-center shadow-sm">LM</div>
        <div className="min-w-0"><div className="font-black text-[14px] leading-tight">Lý Mập Food</div><div className="text-[10px] text-black/40 mt-0.5">QUẢN TRỊ CỬA HÀNG</div></div>
      </Link>
      <div className="px-3 pt-4 pb-2 text-[9px] font-black tracking-[.14em] text-black/30">QUẢN LÝ</div>
      <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
        {NAV.map(({key,to,label,icon:Icon})=><Link key={key} to={to} className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition ${current===key?'bg-[#2D2A26] text-white shadow-sm':'text-black/55 hover:bg-[#FFFBF2] hover:text-[#2D2A26]'}`}>
          <Icon className="w-[16px] h-[16px] shrink-0"/><span className="flex-1">{label}</span>{current===key&&<ChevronRight className="w-3 h-3 opacity-60"/>}
        </Link>)}
      </nav>
      <div className="p-3 border-t border-black/[.06] space-y-1.5">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-black/50 hover:bg-[#FFFBF2] hover:text-[#2D2A26]"><Store className="w-4 h-4"/>Xem trang khách</Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4"/>Đăng xuất</button>
      </div>
    </aside>

    <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/[.07]">
      <div className="h-14 px-4 flex items-center justify-between">
        <Link to="/Admin/Index" className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-[#E0533C] text-white font-black text-[10px] flex items-center justify-center">LM</div><b className="text-sm">Lý Mập Food</b></Link>
        <button onClick={logout} className="p-2 text-red-600"><LogOut className="w-4 h-4"/></button>
      </div>
      <div className="px-3 pb-2 overflow-x-auto"><nav className="flex gap-1 min-w-max">{NAV.map(({key,to,label})=><Link key={key} to={to} className={`px-3 py-1.5 rounded-full text-[10px] font-bold ${current===key?'bg-[#2D2A26] text-white':'bg-black/[.03] text-black/55'}`}>{label}</Link>)}</nav></div>
    </header>

    <main className="lg:ml-[214px] min-h-screen">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
    </main>
  </div>
}
