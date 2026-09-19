import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, User, UserPlus } from 'lucide-react'
import { registerAdmin } from '../../utils/adminAuth'

export default function AdminRegister() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function submit(e) {
    e.preventDefault(); setError('')
    if (password !== confirm) return setError('Mật khẩu xác nhận không khớp.')
    const result = registerAdmin({ name, username, password })
    if (!result.ok) return setError(result.reason === 'exists' ? 'Tên đăng nhập đã tồn tại.' : 'Vui lòng nhập đầy đủ thông tin.')
    setDone(true)
  }

  return <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center p-4 text-[#2D2A26] font-['Plus_Jakarta_Sans']">
    <div className="w-full max-w-md bg-white rounded-2xl border border-black/5 p-6 sm:p-8 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-[#E0533C] text-white font-black text-xl flex items-center justify-center mx-auto">LM</div>
      <h1 className="text-2xl font-black text-center mt-4">Tạo tài khoản Admin</h1>
      <p className="text-xs text-black/50 text-center mt-2">Tài khoản mới sẽ ở trạng thái chờ Chủ quán xác nhận.</p>
      {done ? <div className="mt-6 space-y-4"><div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm font-semibold">Đã gửi yêu cầu thành công. Chủ quán cần xác nhận trước khi bạn có thể đăng nhập.</div><button onClick={()=>navigate('/Admin/Login')} className="w-full bg-[#2D2A26] text-white rounded-xl py-3 text-sm font-bold">Quay lại đăng nhập</button></div> : <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold">{error}</div>}
        <Input icon={User} label="HỌ TÊN" value={name} setValue={setName} placeholder="Nguyễn Văn A" />
        <Input icon={User} label="TÊN ĐĂNG NHẬP" value={username} setValue={setUsername} placeholder="admin2" />
        <Input icon={Lock} label="MẬT KHẨU" type="password" value={password} setValue={setPassword} placeholder="••••••••" />
        <Input icon={Lock} label="XÁC NHẬN MẬT KHẨU" type="password" value={confirm} setValue={setConfirm} placeholder="••••••••" />
        <button className="w-full bg-[#E0533C] text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2"><UserPlus className="w-4 h-4"/>Gửi yêu cầu cấp quyền</button>
      </form>}
      <Link to="/Admin/Login" className="mt-5 flex justify-center items-center gap-1 text-xs font-bold text-black/45 hover:text-[#E0533C]"><ArrowLeft className="w-3.5 h-3.5"/>Quay lại đăng nhập</Link>
    </div>
  </div>
}
function Input({icon:Icon,label,value,setValue,type='text',placeholder}){return <div><label className="block text-xs font-bold text-black/60 mb-1.5">{label}</label><div className="flex items-center gap-2 bg-[#FFFBF2] rounded-xl px-3.5 py-3"><Icon className="w-4 h-4 text-black/40"/><input required type={type} value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder} className="w-full bg-transparent border-0 outline-none text-sm font-semibold"/></div></div>}
