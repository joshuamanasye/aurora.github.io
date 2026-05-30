<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useMyList } from '@/composables/useMyList'
import { titles } from '@/data/titles'

const router = useRouter()
const { user, signOut } = useAuth()
const { myList } = useMyList()

if (!user.value) router.replace('/login')

const editing = ref(false)
const draftName = ref(user.value?.name ?? '')
const plan = ref<'Standard' | 'Premium' | 'Mobile'>(user.value?.plan ?? 'Premium')

watch(plan, (p) => { if (user.value) user.value.plan = p })

const savedCount = computed(() => myList.value.length)
const recentSaved = computed(() => titles.filter((t) => myList.value.includes(t.id)).slice(0, 4))

function save() {
  if (!user.value) return
  user.value.name = draftName.value.trim() || user.value.name
  editing.value = false
}
function logout() { signOut(); router.push('/login') }

// Profile picture
const PLACEHOLDER = 'https://www.gravatar.com/avatar/?d=mp&s=110'
const fileInput = ref<HTMLInputElement | null>(null)

function triggerUpload() { fileInput.value?.click() }

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !user.value) return
  const reader = new FileReader()
  reader.onload = () => {
    if (user.value) user.value.profilePic = reader.result as string
  }
  reader.readAsDataURL(file)
}

function removeProfilePic() {
  if (user.value) user.value.profilePic = undefined
}
</script>

<template>
  <main v-if="user" class="profile">
    <section class="hero">
      <div class="hero-stripe" />
      <div class="hero-content container-x">
        <div class="avatar-xl avatar-edit" @click="triggerUpload" title="Change photo">
          <img :src="user.profilePic || PLACEHOLDER" class="avatar-pic" alt="profile photo" />
          <div class="avatar-edit-overlay">
            <!-- Camera icon (Heroicons / MIT) -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
        </div>
        <div>
          <span class="kicker">Aurora Profile</span>
          <h1>{{ user.name }}</h1>
          <p class="email">{{ user.email }}</p>
          <div class="quick">
            <span class="pill">{{ user.plan }} plan</span>
            <span class="pill">{{ savedCount }} in My List</span>
          </div>
          <button v-if="user.profilePic" class="remove-pic" @click="removeProfilePic">Remove photo</button>
        </div>
      </div>
    </section>

    <section class="container-x grid-cols">
      <div class="card">
        <div class="card-head">
          <h2>Account</h2>
          <button v-if="!editing" class="btn" @click="editing = true">Edit</button>
        </div>
        <div v-if="!editing" class="kv">
          <div><span>Name</span><strong>{{ user.name }}</strong></div>
          <div><span>Email</span><strong>{{ user.email }}</strong></div>
        </div>
        <div v-else class="form">
          <label>Name <input v-model="draftName" /></label>
          <div class="form-actions">
            <button class="btn" @click="editing = false">Cancel</button>
            <button class="btn btn-primary" @click="save">Save</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Subscription</h2>
        <p class="sub-note">Choose how you want to stream. Switch any time.</p>
        <div class="plans">
          <button
            v-for="p in (['Mobile','Standard','Premium'] as const)"
            :key="p"
            class="plan"
            :class="{ on: plan === p }"
            @click="plan = p"
          >
            <div class="plan-name">{{ p }}</div>
            <div class="plan-tag">
              {{ p === 'Mobile' ? 'Phone & tablet · SD' : p === 'Standard' ? 'All devices · Full HD' : 'All devices · 4K + HDR' }}
            </div>
          </button>
        </div>
      </div>

      <div class="card full">
        <h2>Recently saved</h2>
        <div v-if="recentSaved.length" class="mini-row">
          <button
            v-for="t in recentSaved"
            :key="t.id"
            class="mini-card"
            :style="t.image ? { backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: t.color }"
            @click="router.push({ name: 'TitleDetail', params: { id: t.id } })"
          >
            <div class="mini-overlay" />
            <div class="mini-name">{{ t.name }}</div>
          </button>
        </div>
        <p v-else class="muted">Nothing saved yet. Add titles from the home page.</p>
      </div>

      <div class="card full danger">
        <h2>Sign out</h2>
        <p class="muted">You'll need to sign back in to access your list.</p>
        <button class="btn" @click="logout">Sign out of Aurora</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile { padding-bottom: 80px; }

.hero { position: relative; padding: 130px 0 50px; overflow: hidden; }
.hero-stripe {
  position: absolute; left: 0; right: 0; bottom: 0; top: 0;
  background: var(--surface);
}
.hero-content { position: relative; display: flex; gap: 28px; align-items: center; }

.avatar-xl {
  width: 110px; height: 110px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(91, 91, 214, 0.35);
  position: relative; flex-shrink: 0;
}
.avatar-edit { cursor: pointer; }
.avatar-pic { width: 100%; height: 100%; object-fit: cover; display: block; }
.avatar-edit-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid; place-items: center;
  opacity: 0; transition: opacity 0.2s;
  color: #fff;
}
.avatar-edit-overlay svg { width: 28px; height: 28px; }
.avatar-edit:hover .avatar-edit-overlay { opacity: 1; }
.hidden-input { display: none; }
.remove-pic {
  margin-top: 8px;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.remove-pic:hover { color: #fff; }
.kicker {
  font-size: 0.78rem; letter-spacing: 0.32em; font-weight: 700;
  color: var(--accent);
}
.hero h1 { font-size: clamp(2rem, 4vw, 3rem); margin: 6px 0 2px; font-weight: 900; }
.email { color: var(--muted); margin: 0 0 12px; }
.quick { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
}

.grid-cols {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
  margin-top: 30px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
}
.card.full { grid-column: 1 / -1; }
.card.danger { border-color: rgba(229, 77, 46, 0.3); }
.card h2 { margin: 0 0 14px; font-size: 1.1rem; font-weight: 800; }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.card-head h2 { margin: 0; }
.kv { display: flex; flex-direction: column; gap: 10px; }
.kv > div {
  display: flex; justify-content: space-between;
  border-bottom: 1px solid var(--border); padding-bottom: 10px;
}
.kv span { color: var(--muted); }

.form { display: flex; flex-direction: column; gap: 12px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: var(--muted); }
.form input {
  background: var(--bg);
  border: 1px solid var(--border);
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}
.form input:focus { border-color: var(--accent); }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }

.sub-note { color: var(--muted); margin: 0 0 14px; font-size: 0.9rem; }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.plan {
  background: var(--bg);
  border: 1px solid var(--border);
  text-align: left;
  padding: 14px;
  border-radius: 10px;
  color: #fff;
  transition: border-color 0.15s;
}
.plan.on { border-color: var(--accent); background: rgba(91, 91, 214, 0.1); }
.plan-name { font-weight: 800; }
.plan-tag { font-size: 0.78rem; color: var(--muted); margin-top: 4px; }

.mini-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.mini-card {
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  border: none;
  position: relative;
  overflow: hidden;
  color: #fff;
  text-align: left;
  padding: 12px;
  cursor: pointer;
}
.mini-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%);
}
.mini-name {
  position: absolute; bottom: 10px; left: 12px; right: 12px;
  font-weight: 800; font-size: 0.85rem;
}
.muted { color: var(--muted); }

@media (max-width: 820px) {
  .grid-cols { grid-template-columns: 1fr; }
  .plans, .mini-row { grid-template-columns: 1fr 1fr; }
}
</style>
