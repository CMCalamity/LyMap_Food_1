import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, LogIn, ArrowLeft, UserPlus } from 'lucide-react'
import { isAdminLoggedIn, loginAdmin } from '../../utils/adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  useEffect(() => { if (isAdminLoggedIn()) navigate('/Admin/Index', { replace: true }) }, [navigate])
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState(null)
  const [remember, setRemember] = useState(() => localStorage.getItem('admin_remember') === 'true')

  function handleLogin(e) {
    e.preventDefault()
    const result = loginAdmin(username, password)
    if (result.ok) {
      if (remember) { localStorage.setItem('admin_remember', 'true'); localStorage.setItem('admin_username', username.trim()) }
      else { localStorage.removeItem('admin_remember'); localStorage.removeItem('admin_username') }
      navigate('/Admin/Index', { replace: true })
      return
    }
    if (result.reason === 'pending') setMessage({ type: 'warning', text: 'Tài khoản đang chờ Chủ quán xác nhận. Bạn sẽ đăng nhập được sau khi được duyệt.' })
    else if (result.reason === 'rejected') setMessage({ type: 'error', text: 'Yêu cầu cấp quyền Admin đã bị từ chối. Vui lòng liên hệ Chủ quán.' })
    else setMessage({ type: 'error', text: 'Sai tên đăng nhập hoặc mật khẩu.' })
  }

  return <div className="bg-[#FFFBF2] text-[#2D2A26] font-['Plus_Jakarta_Sans'] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div className="bg-decor bg-[#E0533C] w-72 h-72 -top-10 -left-10"></div><div className="bg-decor bg-[#F2C14E] w-80 h-80 -bottom-16 -right-10"></div>
    <div className="relative z-10 w-full max-w-md card-enter">
      <div className="text-center mb-6"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E0533C] to-[#c9432b] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#E0533C]/30">LM</div><p className="mt-3 text-[11px] font-bold tracking-[0.2em] text-[#2D2A26]/50 uppercase">Lý Mập Food · Internal System</p></div>
      <div className="bg-white/80 backdrop-blur p-6 sm:p-7 rounded-2xl space-y-6">
        <div className="space-y-1"><h1 className="text-2xl font-extrabold tracking-tight">Đăng nhập quản trị</h1><p className="text-sm text-[#2D2A26]/60">Đăng nhập sau khi tài khoản đã được Chủ quán xác nhận.</p></div>
        {message && <div className={`${message.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-600'} border px-4 py-3 rounded-xl text-xs font-semibold text-center`}>{message.text}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <Field icon={User} label="TÊN ĐĂNG NHẬP" value={username} onChange={setUsername} placeholder="admin" />
          <div><label className="block text-xs font-bold text-[#2D2A26]/70 mb-1.5">MẬT KHẨU</label><div className="input-wrap flex items-center gap-2.5 bg-[#FFFBF2] rounded-xl border border-transparent px-3.5 py-3 transition"><Lock className="w-4 h-4 text-[#2D2A26]/50 shrink-0"/><input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} placeholder="••••••••" className="w-full min-w-0 bg-transparent border-0 outline-none ring-0 shadow-none text-sm font-semibold placeholder:text-[#2D2A26]/30" required/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff className="w-4 h-4 text-[#2D2A26]/40"/>:<Eye className="w-4 h-4 text-[#2D2A26]/40"/>}</button></div></div>
          <div className="flex items-center justify-between text-xs pt-1"><label className="flex items-center gap-2 font-semibold text-[#2D2A26]/70 cursor-pointer"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="rounded border-black/20 accent-[#E0533C]"/>Nhớ tên đăng nhập</label></div>
          <button type="submit" className="btn-primary w-full bg-[#E0533C] text-white font-bold py-3 rounded-lg text-sm tracking-wide flex items-center justify-center gap-2"><LogIn className="w-4 h-4"/>Đăng nhập hệ thống</button>
        </form>
        <Link to="/Admin/Register" className="w-full flex items-center justify-center gap-2 border border-black/10 rounded-lg py-3 text-sm font-bold hover:bg-[#FFFBF2]"><UserPlus className="w-4 h-4"/>Tạo tài khoản Admin mới</Link>
        <div className="pt-4 border-t border-black/5 text-center"><Link to="/" className="text-xs font-semibold text-[#2D2A26]/50 hover:text-[#E0533C] transition inline-flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5"/>Quay lại trang chủ khách hàng</Link></div>
      </div>
      <p className="text-center text-[11px] text-[#2D2A26]/40 font-medium mt-6">© 2026 Lý Mập Food · MeU Solutions Internal Tools</p>
    </div>
  </div>
}
function Field({ icon:Icon, label, value, onChange, placeholder }) { return <div><label className="block text-xs font-bold text-[#2D2A26]/70 mb-1.5">{label}</label><div className="input-wrap flex items-center gap-2.5 bg-[#FFFBF2] rounded-xl border border-transparent px-3.5 py-3 transition"><Icon className="w-4 h-4 text-[#2D2A26]/50 shrink-0"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full min-w-0 bg-transparent border-0 outline-none ring-0 shadow-none text-sm font-semibold placeholder:text-[#2D2A26]/30" required/></div></div> }
