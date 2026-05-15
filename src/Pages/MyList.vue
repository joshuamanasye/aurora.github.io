<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { titles } from '@/data/titles'
import { useMyList } from '@/composables/useMyList'
import PosterCard from '@/components/PosterCard.vue'

const router = useRouter()
const { myList } = useMyList()
const items = computed(() => titles.filter((t) => myList.value.includes(t.id)))
</script>

<template>
  <main class="mylist">
    <header class="head container-x">
      <h1>My List</h1>
      <p>Everything you've saved for later · {{ items.length }} title{{ items.length === 1 ? '' : 's' }}.</p>
    </header>
    <section v-if="items.length" class="grid container-x">
      <PosterCard v-for="t in items" :key="t.id" :title="t" />
    </section>
    <div v-else class="empty container-x">
      <div class="empty-glyph">✦</div>
      <h2>Your list is quiet.</h2>
      <p>Tap the <strong>+</strong> on any title to save it here.</p>
      <button class="btn btn-primary" @click="router.push('/')">Browse Aurora</button>
    </div>
  </main>
</template>

<style scoped>
.mylist { padding: 110px 0 80px; }
.head h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -0.02em; margin: 0 0 8px; }
.head p { color: var(--muted); margin: 0 0 28px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 22px 16px;
}
.empty {
  padding: 80px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-glyph {
  font-size: 4rem;
  background: var(--aurora);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.empty h2 { margin: 0; }
.empty p { color: var(--muted); margin: 0 0 18px; }
</style>
