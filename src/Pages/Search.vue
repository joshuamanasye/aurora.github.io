<script setup lang="ts">
import { computed, ref, onMounted, nextTick, useTemplateRef } from 'vue'
import { titles } from '@/data/titles'
import PosterCard from '@/components/PosterCard.vue'

const query = ref('')
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

onMounted(async () => {
  await nextTick()
  inputEl.value?.focus()
})

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return titles.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)) ||
      t.cast.some((c) => c.toLowerCase().includes(q)) ||
      t.synopsis.toLowerCase().includes(q),
  )
})

const suggested = computed(() => titles.filter((t) => t.topTen).slice(0, 6))
</script>

<template>
  <main class="search">
    <div class="search-bar container-x">
      <span class="ico">🔍</span>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        placeholder="Search titles, genres, people…"
      />
      <button v-if="query" class="clear" @click="query = ''">×</button>
    </div>

    <section v-if="query" class="container-x">
      <h2>{{ results.length }} result{{ results.length === 1 ? '' : 's' }} for "{{ query }}"</h2>
      <div class="grid">
        <PosterCard v-for="t in results" :key="t.id" :title="t" />
      </div>
      <p v-if="!results.length" class="empty">No matches. Try another genre, name, or vibe.</p>
    </section>

    <section v-else class="container-x">
      <h2>Suggested for you</h2>
      <div class="grid">
        <PosterCard v-for="t in suggested" :key="t.id" :title="t" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.search { padding: 110px 0 80px; }
.search-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 22px !important;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  border-radius: 999px;
  margin-bottom: 36px;
}
.search-bar input {
  flex: 1; background: transparent; border: none; outline: none;
  color: #fff; font-size: 1.05rem;
}
.ico { font-size: 1.1rem; }
.clear {
  background: rgba(255,255,255,0.08); border: none; color: #fff;
  width: 28px; height: 28px; border-radius: 50%;
  font-size: 1.1rem;
}
h2 { font-size: 1.3rem; margin: 0 0 18px; font-weight: 800; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 22px 16px;
}
.empty { color: var(--muted); padding: 30px 0; }
</style>
