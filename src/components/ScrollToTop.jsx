import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-on-primary shadow-[0_8px_24px_0_rgba(45,106,79,0.3)] flex items-center justify-center hover:bg-primary-container hover:scale-105 active:scale-95 transition-all"
      title="Lên đầu trang"
    >
      <span className="material-symbols-outlined">keyboard_arrow_up</span>
    </button>
  )
}
