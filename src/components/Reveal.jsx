import { useEffect, useRef } from 'react'

export default function Reveal({ as: Tag = 'div', className = '', style, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`fade-in-up ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  )
}
