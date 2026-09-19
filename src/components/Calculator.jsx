import { useEffect, useMemo, useState } from 'react'
import { ZALO_PHONE } from '../data/menuData'
import { getMixSettings, formatVnd } from '../utils/storage'

const baseActive = 'base-btn active-btn py-2.5 px-2 text-xs font-bold rounded-2xl bg-primary text-on-primary shadow-sm transition'
const baseInactive = 'base-btn py-2.5 px-2 text-xs font-bold rounded-2xl bg-surface-container-high text-on-surface-variant hover:bg-tertiary-fixed transition'
const sugarActive = 'sugar-btn active-btn py-2.5 text-xs font-bold rounded-2xl bg-secondary-container text-on-secondary-container shadow-sm transition'
const sugarInactive = 'sugar-btn py-2.5 text-xs font-bold rounded-2xl bg-surface-container-high text-on-surface-variant hover:bg-tertiary-fixed transition'
const toppingActive = 'topping-btn py-2.5 text-xs font-bold rounded-xl bg-primary text-on-primary shadow-sm transition'
const toppingInactive = 'topping-btn py-2.5 text-xs font-bold rounded-2xl bg-surface-container-high text-on-surface-variant hover:bg-tertiary-fixed transition'

export default function Calculator() {
  const [settings, setSettings] = useState(getMixSettings)
  useEffect(() => { const fn=()=>setSettings(getMixSettings()); window.addEventListener('lymap-mix-settings',fn); return()=>window.removeEventListener('lymap-mix-settings',fn) }, [])
  const bases = settings.bases.filter(x=>x.enabled!==false)
  const sugars = settings.sugars.filter(x=>x.enabled!==false)
  const toppingOptions = settings.toppings.filter(x=>x.enabled!==false)
  const [baseId, setBaseId] = useState(null)
  const [sugarId, setSugarId] = useState(null)
  const [toppings, setToppings] = useState({})
  useEffect(()=>{ if(bases.length && !bases.some(x=>x.id===baseId)) setBaseId(bases[0].id); if(sugars.length && !sugars.some(x=>x.id===sugarId)) setSugarId(sugars[0].id) },[settings.bases,settings.sugars,baseId,sugarId])
  const base = bases.find(x=>x.id===baseId) || bases[0] || {name:'Chưa có nền sữa',calo:0,price:0}
  const sugar = sugars.find(x=>x.id===sugarId) || sugars[0] || {value:'',label:'Chưa có mức đường',calo:0,price:0}
  function toggleTopping(t) { setToppings(prev=>{const next={...prev}; if(next[t.id]) delete next[t.id]; else next[t.id]=t; return next}) }
  const selectedToppings = Object.values(toppings).filter(t=>toppingOptions.some(x=>x.id===t.id))
  const totalCalo = useMemo(()=>Number(base.calo||0)+Number(sugar.calo||0)+selectedToppings.reduce((a,b)=>a+Number(b.calo||0),0),[base,sugar,selectedToppings])
  const totalPrice = useMemo(()=>Number(base.price||0)+Number(sugar.price||0)+selectedToppings.reduce((a,b)=>a+Number(b.price||0),0),[base,sugar,selectedToppings])
  const toppingNames = selectedToppings.map(t=>t.name || t.label)
  const zaloText = `Chào Lý Mập Food, tôi muốn đặt công thức tự mix: ${base.name} (${sugar.value || sugar.label}) với topping: ${toppingNames.length?toppingNames.join(', '):'Không topping'}. Giá dự kiến: ${formatVnd(totalPrice)}, ${totalCalo} kcal.`
  const zaloHref = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(zaloText)}`
  if (!settings.enabled) return null
  return <section id="calculator" className="py-14 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-surface-container-high">
    <div className="max-w-container-max mx-auto"><div className="text-center max-w-2xl mx-auto mb-7"><span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">{settings.eyebrow || 'Công Cụ Tương Tác'}</span><h2 className="font-headline-md text-headline-md text-primary mt-2">{settings.title}</h2><p className="font-body-md text-body-md text-on-surface-variant mt-2">{settings.subtitle}</p></div>
      <div className="grid lg:grid-cols-12 gap-4 items-start"><div className="lg:col-span-7 bg-surface-container-lowest p-4 sm:p-6 rounded-[24px] soft-shadow border border-tertiary-fixed-dim space-y-4">
        <div><label className="text-xs font-bold text-on-surface block mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-base">local_cafe</span><span>1. Chọn Nền Sữa:</span></label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{bases.map(b=><button key={b.id} onClick={()=>setBaseId(b.id)} className={base.id===b.id?baseActive:baseInactive}>{b.name}<br/><span className="text-[10px] opacity-80">({b.calo||0} kcal · {formatVnd(b.price||0)})</span></button>)}</div>{!bases.length&&<p className="text-xs text-red-500">Admin chưa tạo nền sữa.</p>}</div>
        <div><label className="text-xs font-bold text-on-surface block mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-base">percent</span><span>2. Chọn Mức Đường:</span></label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{sugars.map(s=><button key={s.id} onClick={()=>setSugarId(s.id)} className={sugar.id===s.id?sugarActive:sugarInactive}>{s.label}<br/><span className="text-[10px] opacity-70">{s.price?`+ ${formatVnd(s.price)}`:`${s.calo||0} kcal`}</span></button>)}</div>{!sugars.length&&<p className="text-xs text-red-500">Admin chưa tạo mức đường.</p>}</div>
        <div><label className="text-xs font-bold text-on-surface block mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-base">add_circle</span><span>3. Thêm Topping / Nguyên liệu:</span></label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{toppingOptions.map(t=><button key={t.id} onClick={()=>toggleTopping(t)} className={toppings[t.id]?toppingActive:toppingInactive}>+ {t.label || t.name}<br/><span className="text-[10px] opacity-70">({t.calo||0} kcal · +{formatVnd(t.price||0)})</span></button>)}</div>{!toppingOptions.length&&<p className="text-xs text-black/45">Chưa có topping. Admin có thể thêm trong mục Tự Mix.</p>}</div>
      </div>
      <div className="lg:col-span-5 bg-surface-container-lowest p-4 sm:p-6 rounded-[24px] soft-shadow border border-tertiary-fixed-dim space-y-4"><div className="flex items-center justify-between border-b border-surface-container-high pb-4"><h3 className="font-headline-sm text-headline-sm text-primary">LY SỮA BẠN CHỌN</h3><span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">Healthy</span></div><div className="space-y-3 font-body-md text-body-md text-xs text-on-surface-variant"><div className="flex justify-between items-center"><span>Nền sữa:</span><span className="font-bold text-on-surface">{base.name}</span></div><div className="flex justify-between items-center"><span>Mức đường:</span><span className="font-bold text-primary">{sugar.value || sugar.label}</span></div><div className="flex justify-between items-start gap-4"><span>Topping:</span><span className="font-bold text-primary text-right">{toppingNames.length?toppingNames.join(', '):'Chưa chọn'}</span></div></div><div className="grid grid-cols-2 gap-3"><div className="bg-surface-container-low p-4 rounded-2xl"><div className="text-[10px] text-slate-500 font-bold uppercase">Tổng Calo</div><div className="font-headline-sm text-headline-sm text-primary mt-0.5">{totalCalo} <span className="font-body-md text-xs font-normal text-slate-500">kcal</span></div></div><div className="bg-surface-container-low p-4 rounded-2xl"><div className="text-[10px] text-slate-500 font-bold uppercase">Giá dự kiến</div><div className="font-headline-sm text-headline-sm text-primary mt-0.5">{formatVnd(totalPrice)}</div></div></div><a href={zaloHref} target="_blank" rel="noreferrer" className="w-full bg-primary text-on-primary font-label-bold text-label-bold py-4 rounded-full shadow-[0_8px_24px_0_rgba(45,106,79,0.2)] transition flex items-center justify-center gap-2 text-xs hover:bg-primary-container active:scale-95"><span className="material-symbols-outlined text-sm text-secondary-container">chat</span><span>GỬI CÔNG THỨC ĐẶT QUA ZALO</span></a></div></div>
    </div></section>
}
