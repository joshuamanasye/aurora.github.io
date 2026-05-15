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
    <div class="bg-layer">
      <div class="blob a" />
      <div class="blob b" />
      <div class="blob c" />
    </div>

    <RouterLink to="/" class="brand">
      <span class="brand-mark">✦</span>
      <span class="brand-text">AURORA</span>
    </RouterLink>

    <div class="card">
      <span class="kicker">{{ mode === 'signin' ? 'Welcome back' : 'Join Aurora' }}</span>
      <h1>{{ mode === 'signin' ? 'Sign in to stream' : 'Create your account' }}</h1>
      <p class="sub">A student multimedia project. Any email & password (4+ chars) works.</p>

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
      <button class="btn ghost">Continue as guest</button>

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
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  overflow: hidden;
}
.bg-layer {
  position: absolute; inset: 0; z-index: -1;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 12s ease-in-out infinite;
}
.blob.a { width: 500px; height: 500px; background: #ff4ecd; top: -100px; left: -100px; }
.blob.b { width: 480px; height: 480px; background: #3ee0ff; bottom: -120px; right: -100px; animation-delay: 2s; }
.blob.c { width: 360px; height: 360px; background: #7a5cff; top: 40%; left: 45%; animation-delay: 4s; }
@keyframes float {
  0%,100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.08); }
}

.brand {
  position: absolute; top: 26px; left: 32px;
  display: flex; align-items: center; gap: 10px;
}
.brand-mark {
  font-size: 1.6rem;
  background: var(--aurora);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.brand-text {
  font-weight: 900; letter-spacing: 0.28em;
  background: var(--aurora);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

.card {
  background: rgba(15,15,26,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 22px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
}
.kicker {
  font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 700;
  background: var(--aurora);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
h1 { font-size: 1.8rem; font-weight: 900; margin: 6px 0 6px; letter-spacing: -0.02em; }
.sub { color: var(--muted); margin: 0 0 24px; font-size: 0.9rem; }
.form { display: flex; flex-direction: column; gap: 14px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: var(--muted); }
.form input {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s, background 0.2s;
}
.form input:focus { border-color: rgba(122,92,255,0.6); background: rgba(255,255,255,0.08); }
.err { color: #ff8a8a; font-size: 0.85rem; margin: -4px 0 0; }
.submit { width: 100%; justify-content: center; padding: 12px; margin-top: 6px; }
.divider {
  display: flex; align-items: center; gap: 10px;
  color: var(--muted); margin: 22px 0; font-size: 0.78rem;
}
.divider::before, .divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
}
.ghost { width: 100%; justify-content: center; }
.switch { text-align: center; margin-top: 22px; color: var(--muted); font-size: 0.88rem; }
.switch a { color: #fff; font-weight: 700; cursor: pointer; text-decoration: underline; }
</style>
