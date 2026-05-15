<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './Pages/Navbar.vue'

const route = useRoute()
const hideChrome = computed(() => route.name === 'Login')
</script>

<template>
  <div class="app-shell">
    <Navbar v-if="!hideChrome" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <footer v-if="!hideChrome" class="footer">
      <div class="footer-inner">
        <div class="brand-mini">AURORA</div>
        <p>© 2026 Aurora Streaming · A student project for Multimedia class.</p>
        <div class="links">
          <a>Help</a><a>Terms</a><a>Privacy</a><a>Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.footer { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); padding: 48px 24px; color: #8a8aa3; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
.brand-mini { font-weight: 900; letter-spacing: 0.3em; color: var(--accent); }
.links { display: flex; gap: 18px; flex-wrap: wrap; font-size: 0.85rem; }
.links a { cursor: pointer; }
.links a:hover { color: #fff; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
