import { useEffect, useState } from 'react'
import { Plus, Trash2, RotateCcw, GripVertical, Save, Eye, EyeOff } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import RequireAdmin from '../../components/admin/RequireAdmin'
import { DEFAULT_MIX_SETTINGS, getMixSettings, saveMixSettings, formatVnd } from '../../utils/storage'

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

function Row({ item, type, onChange, onRemove }) {
  const isSugar = type === 'sugars'
  return <div className="grid grid-cols-[20px_1fr_90px_100px_70px_32px] gap-2 items-center bg-[#FFFBF2] rounded-lg px-2 py-2 border border-black/5">
    <GripVertical className="w-4 h-4 text-black/20" />
    <div className="grid sm:grid-cols-2 gap-2">
      <input value={item.label ?? item.name ?? ''} onChange={e=>onChange({ label: e.target.value, ...(item.name !== undefined ? {name: e.target.value} : {}) })} className="admin-field bg-white rounded-md px-2 py-1.5 text-[11px]" placeholder="Tên hiển thị" />
      {isSugar ? <input value={item.value ?? ''} onChange={e=>onChange({value:e.target.value})} className="admin-field bg-white rounded-md px-2 py-1.5 text-[11px]" placeholder="Giá trị gửi đơn" /> : <input value={item.name ?? ''} onChange={e=>onChange({name:e.target.value})} className="admin-field bg-white rounded-md px-2 py-1.5 text-[11px]" placeholder="Tên nguyên liệu" />}
    </div>
    <input type="number" min="0" value={item.calo ?? 0} onChange={e=>onChange({calo:Number(e.target.value)||0})} className="admin-field bg-white rounded-md px-2 py-1.5 text-[11px]" title="Calo" placeholder="kcal" />
    <input type="number" min="0" value={item.price ?? 0} onChange={e=>onChange({price:Number(e.target.value)||0})} className="admin-field bg-white rounded-md px-2 py-1.5 text-[11px]" title="Giá cộng thêm" placeholder="đ" />
    <button onClick={()=>onChange({enabled:!item.enabled})} className={`inline-flex items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[9px] font-black ${item.enabled!==false?'bg-emerald-50 text-emerald-700':'bg-black/5 text-black/35'}`}>{item.enabled!==false?<Eye className="w-3 h-3"/>:<EyeOff className="w-3 h-3"/>}{item.enabled!==false?'Bật':'Tắt'}</button>
    <button onClick={onRemove} className="p-1.5 rounded-md text-red-500 hover:bg-red-50" title="Xóa"><Trash2 className="w-3.5 h-3.5"/></button>
  </div>
}

function Section({ title, hint, items, type, onAdd, onUpdate, onRemove }) {
  return <section className="bg-white rounded-xl border border-black/5 p-4 sm:p-5 space-y-3">
    <div className="flex items-center justify-between gap-3"><div><h2 className="font-black text-sm">{title}</h2><p className="text-[10px] text-black/40 mt-0.5">{hint}</p></div><button onClick={onAdd} className="px-2.5 py-1.5 rounded-lg bg-[#2D2A26] text-white text-[10px] font-black inline-flex items-center gap-1"><Plus className="w-3 h-3"/> Thêm</button></div>
    <div className="grid grid-cols-[20px_1fr_90px_100px_70px_32px] gap-2 px-2 text-[9px] font-black uppercase text-black/30"><span/><span>Tên / giá trị</span><span>Calo</span><span>Giá cộng</span><span>Hiển thị</span><span/></div>
    <div className="space-y-2">{items.map((item)=><Row key={item.id} item={item} type={type} onChange={patch=>onUpdate(item.id,patch)} onRemove={()=>onRemove(item.id)}/>)}</div>
  </section>
}

function AdminMixInner(){
  const [form,setForm]=useState(getMixSettings)
  const [saved,setSaved]=useState(false)
  useEffect(()=>{ const fn=()=>setForm(getMixSettings()); window.addEventListener('lymap-mix-settings',fn); return()=>window.removeEventListener('lymap-mix-settings',fn)},[])
  function persist(next){ setForm(next); saveMixSettings(next); setSaved(true); clearTimeout(window.__mixTimer); window.__mixTimer=setTimeout(()=>setSaved(false),1200) }
  function patchList(type,id,patch){ persist({...form,[type]:form[type].map(x=>x.id===id?{...x,...patch}:x)}) }
  function remove(type,id){ if(!confirm('Xóa lựa chọn này khỏi Tự Mix?')) return; persist({...form,[type]:form[type].filter(x=>x.id!==id)}) }
  function add(type){
    const item = type==='bases'
      ? {id:uid('base'),name:'Nền sữa mới',calo:100,price:10000,enabled:true}
      : type==='sugars'
      ? {id:uid('sugar'),value:'Mức đường mới',label:'Mức đường mới',calo:0,price:0,enabled:true}
      : {id:uid('top'),name:'Topping mới',label:'Topping mới',calo:30,price:5000,enabled:true}
    persist({...form,[type]:[...form[type],item]})
  }
  function reset(){ if(confirm('Khôi phục cấu hình Tự Mix mặc định?')) persist(JSON.parse(JSON.stringify(DEFAULT_MIX_SETTINGS))) }
  return <AdminLayout active="mix"><div className="max-w-5xl space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-black">Tự Mix & nguyên liệu</h1><p className="text-xs text-black/45 mt-1">Admin có thể tự thêm món nền, mức đường, topping/nguyên liệu mới. Thay đổi được lưu ngay và hiển thị ở trang khách.</p></div><div className="flex items-center gap-2"><span className="text-[10px] font-bold text-emerald-600">{saved?'✓ Đã tự lưu':''}</span><button onClick={reset} className="px-2.5 py-1.5 rounded-lg bg-white border border-black/5 text-[10px] font-bold inline-flex items-center gap-1"><RotateCcw className="w-3 h-3"/> Mặc định</button></div></div>
    <section className="bg-white rounded-xl border border-black/5 p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-black text-sm">Cài đặt công cụ</h2><p className="text-[10px] text-black/40 mt-0.5">Tiêu đề và trạng thái hiển thị trên trang khách.</p></div><button onClick={()=>persist({...form,enabled:!form.enabled})} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black ${form.enabled?'bg-emerald-50 text-emerald-700':'bg-black/5 text-black/40'}`}>{form.enabled?'Đang hiển thị':'Đang tắt'}</button></div><div className="grid sm:grid-cols-3 gap-3 mt-4"><Field label="Nhãn khu vực" value={form.eyebrow} onChange={v=>persist({...form,eyebrow:v})}/><Field label="Tiêu đề" value={form.title} onChange={v=>persist({...form,title:v})}/><Field label="Mô tả" value={form.subtitle} onChange={v=>persist({...form,subtitle:v})}/></div></section>
    <Section title="Nền sữa / sản phẩm cơ bản" hint="Ví dụ: sữa đậu nành, sữa bắp, sữa hạt mới. Giá là giá nền của ly." items={form.bases} type="bases" onAdd={()=>add('bases')} onUpdate={(id,p)=>patchList('bases',id,p)} onRemove={id=>remove('bases',id)}/>
    <Section title="Mức đường / tùy chọn" hint="Có thể thêm kiểu đường mới; calo và phụ phí có thể đặt riêng." items={form.sugars} type="sugars" onAdd={()=>add('sugars')} onUpdate={(id,p)=>patchList('sugars',id,p)} onRemove={id=>remove('sugars',id)}/>
    <Section title="Topping / nguyên liệu thêm" hint="Thêm bất kỳ topping hoặc nguyên liệu mới. Giá cộng và calo sẽ tính vào ly tự mix." items={form.toppings} type="toppings" onAdd={()=>add('toppings')} onUpdate={(id,p)=>patchList('toppings',id,p)} onRemove={id=>remove('toppings',id)}/>
    <div className="bg-[#2D2A26] text-white rounded-xl p-4 text-[11px] flex gap-3 items-start"><Save className="w-4 h-4 shrink-0 mt-0.5"/><div><b>Tự lưu & đồng bộ:</b> Không cần nút lưu. Khi admin sửa tên, calo, giá hoặc bật/tắt lựa chọn, dữ liệu được lưu ngay. Công cụ Tự Mix phía khách sẽ đọc cấu hình mới sau khi tải lại trang.</div></div>
  </div></AdminLayout>
}
function Field({label,value,onChange}){return <label className="block"><span className="block text-[10px] font-black mb-1.5 text-black/60">{label}</span><input value={value??''} onChange={e=>onChange(e.target.value)} className="admin-field w-full bg-[#FFFBF2] rounded-lg px-3 py-2.5 text-xs"/></label>}
export default function AdminMix(){return <RequireAdmin><AdminMixInner/></RequireAdmin>}
