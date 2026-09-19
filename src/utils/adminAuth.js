const ACCOUNTS_KEY = 'lymap_admin_accounts'
const SESSION_KEY = 'lymap_admin_session'

const DEFAULT_OWNER = {
  id: 'owner-001',
  username: 'admin',
  password: '123456',
  name: 'Chủ quán',
  role: 'owner',
  status: 'approved',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function readAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    const accounts = raw ? JSON.parse(raw) : []
    if (!Array.isArray(accounts)) return [DEFAULT_OWNER]
    // Always reserve the default owner credentials as admin / 123456.
    // This also repairs an older/local account named `admin` that may have
    // been left in a pending/rejected state by a previous version.
    const hasDefaultOwner = accounts.some(a => a.id === DEFAULT_OWNER.id)
    const hasAdminUsername = accounts.some(a => String(a.username || '').toLowerCase() === DEFAULT_OWNER.username)
    if (!hasDefaultOwner || !hasAdminUsername) {
      const withoutAdmin = accounts.filter(a => String(a.username || '').toLowerCase() !== DEFAULT_OWNER.username && a.id !== DEFAULT_OWNER.id)
      const next = [DEFAULT_OWNER, ...withoutAdmin]
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next))
      return next
    }
    // Keep the built-in owner approved with the documented default login.
    const next = accounts.map(a => a.id === DEFAULT_OWNER.id ? DEFAULT_OWNER : a)
    if (JSON.stringify(next) !== JSON.stringify(accounts)) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next))
    return next
  } catch {
    return [DEFAULT_OWNER]
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function getAdminAccounts() {
  return readAccounts()
}

export function getCurrentAdmin() {
  try {
    // Phiên đăng nhập chỉ tồn tại trong tab/browser session.
    // Không dùng localStorage cho session để đóng trình duyệt sẽ đăng xuất.
    const legacy = localStorage.getItem(SESSION_KEY)
    if (legacy) localStorage.removeItem(SESSION_KEY)
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAdminLoggedIn() {
  return !!getCurrentAdmin()
}

export function isOwnerLoggedIn() {
  return getCurrentAdmin()?.role === 'owner'
}

export function setAdminLoggedIn(account) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  }))
}

export function logoutAdmin() {
  try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY) } catch {}
}

export function loginAdmin(username, password) {
  const account = readAccounts().find(a => a.username.toLowerCase() === username.trim().toLowerCase())
  if (!account || account.password !== password.trim()) return { ok: false, reason: 'invalid' }
  if (account.status !== 'approved') return { ok: false, reason: account.status, account }
  setAdminLoggedIn(account)
  return { ok: true, account }
}

export function registerAdmin({ username, password, name }) {
  const cleanUsername = username.trim()
  const cleanName = name.trim()
  if (!cleanUsername || !password.trim() || !cleanName) return { ok: false, reason: 'missing' }
  const accounts = readAccounts()
  if (accounts.some(a => a.username.toLowerCase() === cleanUsername.toLowerCase())) return { ok: false, reason: 'exists' }
  const account = {
    id: `admin-${Date.now()}`,
    username: cleanUsername,
    password: password.trim(),
    name: cleanName,
    role: 'admin',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  writeAccounts([...accounts, account])
  return { ok: true, account }
}

export function updateAdminStatus(id, status) {
  const accounts = readAccounts()
  const account = accounts.find(a => a.id === id)
  if (!account || account.role === 'owner') return false
  writeAccounts(accounts.map(a => a.id === id ? { ...a, status } : a))
  return true
}

export function getPendingAdmins() {
  return readAccounts().filter(a => a.role === 'admin' && a.status === 'pending')
}

export function changeAdminPassword(currentPassword, newPassword) {
  const session = getCurrentAdmin()
  if (!session) return { ok: false, reason: 'not_logged_in' }
  const nextPassword = String(newPassword || '').trim()
  if (nextPassword.length < 6) return { ok: false, reason: 'too_short' }
  const accounts = readAccounts()
  const account = accounts.find(a => a.id === session.id)
  if (!account) return { ok: false, reason: 'not_found' }
  if (String(account.password) !== String(currentPassword || '').trim()) return { ok: false, reason: 'wrong_current' }
  const next = accounts.map(a => a.id === account.id ? { ...a, password: nextPassword } : a)
  writeAccounts(next)
  setAdminLoggedIn({ ...account, password: nextPassword })
  return { ok: true }
}
