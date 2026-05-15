import { ref, watch } from 'vue'

const STORAGE_KEY = 'aurora.user'

export interface AuroraUser {
  name: string
  email: string
  avatar: string // emoji / glyph
  plan: 'Standard' | 'Premium' | 'Mobile'
}

function load(): AuroraUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuroraUser) : null
  } catch {
    return null
  }
}

const user = ref<AuroraUser | null>(load())

watch(user, (val) => {
  if (val) localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  else localStorage.removeItem(STORAGE_KEY)
})

export function useAuth() {
  function signIn(email: string) {
    const name = email.split('@')[0] || 'viewer'
    user.value = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      avatar: '✦',
      plan: 'Premium',
    }
  }
  function signOut() {
    user.value = null
  }
  return { user, signIn, signOut }
}
