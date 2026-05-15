<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { titles } from '@/data/titles'
import PosterCard from '@/components/PosterCard.vue'

const route = useRoute()

const headingMap: Record<string, string> = {
  movies: 'Movies',
  series: 'TV Series',
  new: 'New & Popular',
}

const heading = computed(() => headingMap[String(route.params.category ?? '')] ?? 'Browse')

const allGenres = computed(() => {
  const s = new Set<string>()
  titles.forEach((t) => t.genres.forEach((g) => s.add(g)))
  return ['All', ...Array.from(s).sort()]
})
const activeGenre = ref('All')
const sort = ref<'match' | 'year' | 'name'>('match')

const filtered = computed(() => {
  const cat = String(route.params.category ?? '')
  let arr = titles.slice()
  if (cat === 'movies') arr = arr.filter((t) => t.kind === 'movie')
  else if (cat === 'series') arr = arr.filter((t) => t.kind === 'series')
  else if (cat === 'new') arr = arr.filter((t) => t.newArrival)
  if (activeGenre.value !== 'All') arr = arr.filter((t) => t.genres.includes(activeGenre.value))
  arr.sort((a, b) => {
    if (sort.value === 'match') return b.match - a.match
    if (sort.value === 'year') return b.year - a.year
    return a.name.localeCompare(b.name)
  })
  return arr
})
</script>

<template>
  <main class="browse">
    <header class="head container-x">
      <h1>{{ heading }}</h1>
      <p>{{ filtered.length }} titles · curated by Aurora.</p>
      <div class="filters">
        <div class="chips">
          <button
            v-for="g in allGenres"
            :key="g"
            class="chip"
            :class="{ active: activeGenre === g }"
            @click="activeGenre = g"
          >{{ g }}</button>
        </div>
        <select v-model="sort" class="sort">
          <option value="match">Top match</option>
          <option value="year">Newest</option>
          <option value="name">A → Z</option>
        </select>
      </div>
    </header>

    <section class="grid container-x">
      <PosterCard v-for="t in filtered" :key="t.id" :title="t" />
    </section>
    <p v-if="!filtered.length" class="empty container-x">No titles match that filter.</p>
  </main>
</template>

<style scoped>
.browse { padding: 110px 0 80px; }
.head h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -0.02em; margin: 0 0 8px; }
.head p { color: var(--muted); margin: 0 0 22px; }
.filters {
  display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
}
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.78);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
}
.chip:hover { color: #fff; background: rgba(255,255,255,0.1); }
.chip.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  font-weight: 700;
}
.sort {
  margin-left: auto;
  background: rgba(255,255,255,0.05);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 22px 16px;
}
.empty { padding: 60px 24px; color: var(--muted); text-align: center; }
</style>
