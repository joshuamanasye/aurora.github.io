<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=80'

const scrolled = ref(false)
const menuOpen = ref(false)
const router = useRouter()
const { user, signOut } = useAuth()

function onScroll() { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function goSearch() { router.push({ name: 'Search' }) }
function logout() {
  signOut()
  menuOpen.value = false
  router.push('/login')
}
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav-inner container-x">
      <RouterLink to="/" class="brand">
        <i class="fa-solid fa-tv brand-icon" aria-hidden="true"></i>
        <span class="brand-text">AURORA</span>
      </RouterLink>

      <nav class="primary">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/browse/series" active-class="active">Series</RouterLink>
        <RouterLink to="/browse/movies" active-class="active">Movies</RouterLink>
        <RouterLink to="/browse/new" active-class="active">New &amp; Popular</RouterLink>
        <RouterLink to="/my-list" active-class="active">My List</RouterLink>
      </nav>

      <div class="actions">
        <button class="icon-btn" @click="goSearch" aria-label="search">
          <!-- Search icon (Heroicons / MIT) -->
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <template v-if="user">
          <button class="avatar" @click="menuOpen = !menuOpen">
            <img :src="user.profilePic || DEFAULT_AVATAR" class="avatar-img" alt="profile" />
          </button>
          <div v-if="menuOpen" class="menu" @click.self="menuOpen = false">
            <div class="menu-panel">
              <div class="menu-user">
                <div class="menu-avatar">
                  <img :src="user.profilePic || DEFAULT_AVATAR" class="avatar-img" alt="profile" />
                </div>
                <div>
                  <div class="menu-name">{{ user.name }}</div>
                  <div class="menu-plan">{{ user.plan }} plan</div>
                </div>
              </div>
              <RouterLink to="/profile" @click="menuOpen = false">Profile</RouterLink>
              <RouterLink to="/my-list" @click="menuOpen = false">My List</RouterLink>
              <button @click="logout">Sign out</button>
            </div>
          </div>
        </template>
        <RouterLink v-else to="/login" class="btn btn-primary signin">Sign In</RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  transition: background 0.25s ease;
}
.nav.scrolled {
  background: rgba(13, 13, 18, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex; align-items: center; gap: 28px;
  padding: 14px 24px;
}
.brand { display: flex; align-items: center; gap: 8px; }
.brand-icon {
  font-size: 1.4rem;
  color: var(--accent);
  flex-shrink: 0;
}
.brand-text {
  font-weight: 900;
  letter-spacing: 0.28em;
  font-size: 1rem;
  color: var(--accent);
}
.primary { display: flex; gap: 22px; }
.primary a {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.92rem;
  font-weight: 500;
  transition: color 0.15s ease;
}
.primary a:hover { color: #fff; }
.primary a.active { color: #fff; font-weight: 700; }
.actions { margin-left: auto; display: flex; align-items: center; gap: 14px; position: relative; }
.icon-btn {
  background: transparent; border: none; color: #fff;
  padding: 6px; display: grid; place-items: center;
}
.icon-btn svg { width: 20px; height: 20px; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--accent);
  color: #fff;
  font-weight: 900;
  display: grid; place-items: center;
  overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.signin { padding: 8px 18px; font-size: 0.85rem; border-radius: 8px; }
.menu { position: absolute; right: 0; top: 50px; z-index: 60; }
.menu-panel {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  min-width: 220px;
  display: flex; flex-direction: column; gap: 4px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
.menu-panel a, .menu-panel button {
  text-align: left;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}
.menu-panel a:hover, .menu-panel button:hover { background: var(--surface); color: #fff; }
.menu-user {
  display: flex; gap: 10px; align-items: center;
  padding: 8px 6px 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 6px;
}
.menu-avatar {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--accent); color: #fff; font-weight: 900;
  display: grid; place-items: center;
  overflow: hidden; flex-shrink: 0;
}
.menu-name { font-weight: 700; color: #fff; }
.menu-plan { font-size: 0.75rem; color: var(--muted); }

@media (max-width: 880px) {
  .primary { display: none; }
}
</style>
