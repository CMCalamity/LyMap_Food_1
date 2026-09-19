import { useState } from 'react'
import { Plus, Trash2, RotateCcw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import RequireAdmin from '../../components/admin/RequireAdmin'
import { getCombos, saveCombos, DEFAULT_COMBOS } from '../../utils/combos'

const Field = ({ label, value, onChange, type = 'text' }) => (
  <label className="block">
    <span className="block text-[10px] font-black text-black/55 mb-1">{label}</span>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
      className="admin-field w-full bg-[#FFFBF2] rounded-lg px-3 py-2.5 text-xs"
    />
  </label>
)

function Inner() {
  const [list, setList] = useState(getCombos)

  const persist = (next) => {
    setList(next)
    saveCombos(next)
  }

  const patch = (index, key, value) => {
    persist(list.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: value } : item
    )))
  }

  const addCombo = () => {
    persist([
      ...list,
      {
        id: `combo-${Date.now()}`,
        name: 'Combo mới',
        description: 'Mô tả combo',
        price: 0,
        image: '',
        enabled: true,
        badge: 'Mới',
      },
    ])
  }

  const removeCombo = (index) => {
    persist(list.filter((_, itemIndex) => itemIndex !== index))
  }

  const resetCombos = () => {
    if (confirm('Khôi phục combo mặc định?')) {
      persist(JSON.parse(JSON.stringify(DEFAULT_COMBOS)))
    }
  }

  return (
    <AdminLayout active="combos">
      <div className="space-y-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Combo / Set bán kèm</h1>
            <p className="text-xs text-black/45 mt-1">
              Tạo combo cố định để khách thêm thẳng vào giỏ. Thay đổi tự lưu.
            </p>
          </div>
          <button
            onClick={addCombo}
            className="px-3 py-2 rounded-lg bg-[#E0533C] text-white text-xs font-black inline-flex gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm combo
          </button>
        </div>

        {list.map((item, index) => (
          <section
            key={item.id}
            className="bg-white rounded-xl border border-black/5 p-4"
          >
            <div className="grid lg:grid-cols-[1fr_1fr_140px_1fr] gap-3">
              <Field
                label="Tên combo"
                value={item.name}
                onChange={(value) => patch(index, 'name', value)}
              />
              <Field
                label="Mô tả"
                value={item.description}
                onChange={(value) => patch(index, 'description', value)}
              />
              <Field
                label="Giá"
                type="number"
                value={item.price}
                onChange={(value) => patch(index, 'price', value)}
              />
              <Field
                label="Link ảnh"
                value={item.image}
                onChange={(value) => patch(index, 'image', value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="w-40">
                <Field
                  label="Nhãn"
                  value={item.badge}
                  onChange={(value) => patch(index, 'badge', value)}
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={item.enabled !== false}
                  onChange={(e) => patch(index, 'enabled', e.target.checked)}
                />
                Hiện trên trang khách
              </label>

              <button
                onClick={() => removeCombo(index)}
                className="ml-auto text-red-500 text-xs font-bold inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa
              </button>
            </div>
          </section>
        ))}

        <button
          onClick={resetCombos}
          className="text-xs font-bold text-black/45 inline-flex gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Khôi phục mặc định
        </button>
      </div>
    </AdminLayout>
  )
}

export default function AdminCombos() {
  return (
    <RequireAdmin>
      <Inner />
    </RequireAdmin>
  )
}
