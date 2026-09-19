import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CART_KEY = 'lymap_cart'
const FAVORITES_KEY = 'lymap_favorites'

const ShopContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readJson(CART_KEY, []))
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []))
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  function addToCart(item, unitPrice, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p))
      }
      return [...prev, { id: item.id, title: item.title, img: item.img, price: unitPrice, qty }]
    })
    setCartOpen(true)
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)))
  }

  function clearCart() {
    setCart([])
  }

  function toggleFavorite(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const isFavorite = (id) => favorites.includes(id)

  const cartCount = useMemo(() => cart.reduce((sum, p) => sum + p.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((sum, p) => sum + p.qty * p.price, 0), [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartTotal,
    cartOpen,
    setCartOpen,
    favorites,
    toggleFavorite,
    isFavorite,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
