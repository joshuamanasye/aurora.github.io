<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signIn } = useAuth()

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  error.value = ''
  if (!email.value.includes('@')) { error.value = 'Enter a valid email.'; return }
  if (password.value.length < 4) { error.value = 'Password must be at least 4 characters.'; return }
  signIn(email.value.trim())
  router.push('/')
}
</script>

<template>
  <div class="login-page">
    <div class="accent-panel" />

    <RouterLink to="/" class="brand">
      <span class="brand-mark">✦</span>
      <span class="brand-text">AURORA</span>
    </RouterLink>

    <div class="card">
      <span class="kicker">{{ mode === 'signin' ? 'Welcome back' : 'Join Aurora' }}</span>
      <h1>{{ mode === 'signin' ? 'Sign in to stream' : 'Create your account' }}</h1>
      <p class="sub">A student multimedia project. Any email &amp; password (4+ chars) works.</p>

      <form @submit.prevent="submit" class="form">
        <label>
          Email
          <input v-model="email" type="email" placeholder="you@aurora.tv" autocomplete="email" />
        </label>
        <label>
          Password
          <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
        </label>
        <p v-if="error" class="err">{{ error }}</p>
        <button class="btn btn-primary submit" type="submit">
          {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
        </button>
      </form>

      <div class="divider"><span>or</span></div>
      <button class="btn ghost" @click="router.push('/')">Continue as guest</button>

      <p class="switch">
        <template v-if="mode === 'signin'">
          New here?
          <a @click="mode = 'signup'">Create an account.</a>
        </template>
        <template v-else>
          Already streaming?
          <a @click="mode = 'signin'">Sign in.</a>
        </template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

.accent-panel {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 45%;
  background: var(--accent);
  opacity: 0.08;
  clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.brand {
  position: absolute;
  top: 26px; left: 32px;
  display: flex; align-items: center; gap: 8px;
}
.brand-mark { font-size: 1.4rem; color: var(--accent); }
.brand-text {
  font-weight: 900; letter-spacing: 0.28em; font-size: 1rem;
  color: var(--accent);
}

.card {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
}

.kicker {
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  font-weight: 700;
  color: var(--accent);
}
h1 {
  font-size: 1.8rem; font-weight: 900;
  margin: 6px 0 6px; letter-spacing: -0.02em;
}
.sub { color: var(--muted); margin: 0 0 24px; font-size: 0.88rem; }

.form { display: flex; flex-direction: column; gap: 14px; }
.form label {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 0.85rem; color: var(--muted);
}
.form input {
  background: var(--surface);
  border: 1px solid var(--border);
  color: #fff;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease;
}
.form input:focus { border-color: var(--accent); }
.err { color: #f87171; font-size: 0.85rem; margin: -4px 0 0; }
.submit { width: 100%; justify-content: center; padding: 12px; margin-top: 4px; border-radius: 8px; }

.divider {
  display: flex; align-items: center; gap: 10px;
  color: var(--muted); margin: 22px 0; font-size: 0.78rem;
}
.divider::before, .divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}
.ghost { width: 100%; justify-content: center; border-radius: 8px; }

.switch { text-align: center; margin-top: 20px; color: var(--muted); font-size: 0.88rem; }
.switch a { color: var(--accent); font-weight: 700; cursor: pointer; }
</style>
