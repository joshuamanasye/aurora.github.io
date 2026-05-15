<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { titles } from '@/data/titles'
import Row from '@/components/Row.vue'
import { useMyList } from '@/composables/useMyList'

const router = useRouter()
const { has, toggle } = useMyList()

const featured = computed(() => titles.filter((t) => t.trending && t.topTen))
const featuredIndex = ref(0)
const hero = computed(() => featured.value[featuredIndex.value] ?? titles[0]!)

let timer: number | undefined
onMounted(() => {
  timer = window.setInterval(() => {
    featuredIndex.value = (featuredIndex.value + 1) % featured.value.length
  }, 7000)
})
onUnmounted(() => { if (timer) window.clearInterval(timer) })

const trending = computed(() => titles.filter((t) => t.trending))
const newReleases = computed(() => titles.filter((t) => t.newArrival))
const topTen = computed(() => titles.filter((t) => t.topTen).slice(0, 10))
const moviesOnly = computed(() => titles.filter((t) => t.kind === 'movie'))
const seriesOnly = computed(() => titles.filter((t) => t.kind === 'series'))

function openHero() {
  router.push({ name: 'TitleDetail', params: { id: hero.value.id } })
}
</script>

<template>
  <main>
    <section class="hero" :style="{ '--hero-color': hero.color }">
      <div class="hero-overlay" />
      <div class="hero-content container-x">
        <span class="kicker">★ Aurora Original</span>
        <h1 class="hero-title">{{ hero.name }}</h1>
        <p class="hero-tag">{{ hero.tagline }}</p>
        <div class="hero-meta">
          <span class="match">{{ hero.match }}% Match</span>
          <span>{{ hero.year }}</span>
          <span class="rating-pill">{{ hero.rating }}</span>
          <span>{{ hero.runtime }}</span>
        </div>
        <p class="hero-syn">{{ hero.synopsis }}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="openHero">▶ Play</button>
          <button class="btn" @click="openHero">More Info</button>
          <button class="btn" @click="toggle(hero.id)">
            {{ has(hero.id) ? '✓ In My List' : '+ My List' }}
          </button>
        </div>
        <div class="dots">
          <button
            v-for="(t, i) in featured"
            :key="t.id"
            class="dot"
            :class="{ active: i === featuredIndex }"
            @click="featuredIndex = i"
            :aria-label="`Show ${t.name}`"
          />
        </div>
      </div>
    </section>

    <div class="rows">
      <Row heading="🔥 Trending Now" :titles="trending" />
      <Row heading="Top 10 in Aurora Today" :titles="topTen" ranked />
      <Row heading="New &amp; Noteworthy" :titles="newReleases" />
      <Row heading="Films We Love" :titles="moviesOnly" />
      <Row heading="Bingeable Series" :titles="seriesOnly" />
    </div>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 86vh;
  display: flex;
  align-items: flex-end;
  padding: 96px 0 80px;
  background: var(--hero-color);
  transition: background 0.8s ease;
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13,13,18,0.2) 0%, rgba(13,13,18,0.55) 55%, rgba(13,13,18,1) 100%),
    linear-gradient(90deg, rgba(13,13,18,0.7) 0%, rgba(13,13,18,0.0) 65%);
}
.hero-content { position: relative; max-width: 720px; }

.kicker {
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.32em;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 14px;
}
.hero-title {
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 12px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.4);
}
.hero-tag {
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 14px;
  font-size: 1.05rem;
}
.hero-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 14px;
}
.match { color: #4ade80; font-weight: 800; }
.rating-pill {
  border: 1px solid rgba(255, 255, 255, 0.45);
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
}
.hero-syn {
  max-width: 620px;
  font-size: 1.05rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 22px;
}
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.hero-actions .btn { border-radius: 8px; }

.dots { display: flex; gap: 8px; margin-top: 28px; }
.dot {
  width: 28px; height: 4px; border-radius: 2px;
  border: none; padding: 0;
  background: rgba(255, 255, 255, 0.25);
  transition: background 0.2s ease, width 0.2s ease;
}
.dot.active { background: #fff; width: 44px; }

.rows { padding-bottom: 60px; }
</style>
