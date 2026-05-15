<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTitle, recommendations } from '@/data/titles'
import { useMyList } from '@/composables/useMyList'
import Row from '@/components/Row.vue'

const route = useRoute()
const router = useRouter()
const { has, toggle } = useMyList()

const title = computed(() => getTitle(String(route.params.id)))
const recs = computed(() => (title.value ? recommendations(title.value.id) : []))

const episodes = computed(() => {
  if (!title.value || title.value.kind !== 'series') return []
  return [
    { n: 1, title: 'Cold Open', dur: '52m' },
    { n: 2, title: 'Static', dur: '48m' },
    { n: 3, title: 'Margin of Error', dur: '55m' },
    { n: 4, title: 'The Long Light', dur: '49m' },
    { n: 5, title: 'No Such Thing', dur: '60m' },
  ]
})
</script>

<template>
  <main v-if="title" class="detail">
    <section class="banner" :style="{ '--title-color': title.color }">
      <button class="back" @click="router.back()">‹ Back</button>
      <div class="banner-shade" />
      <div class="banner-inner container-x">
        <div class="poster-side">
          <div class="poster-art" :style="{ background: title.color }">
            <div class="poster-glyph">{{ title.glyph }}</div>
          </div>
        </div>
        <div class="info-side">
          <span class="kicker">{{ title.kind === 'series' ? 'Limited Series' : 'Feature Film' }}</span>
          <h1>{{ title.name }}</h1>
          <p class="tag">{{ title.tagline }}</p>
          <div class="meta">
            <span class="match">{{ title.match }}% Match</span>
            <span>{{ title.year }}</span>
            <span class="rating-pill">{{ title.rating }}</span>
            <span>{{ title.runtime }}</span>
          </div>
          <p class="synopsis">{{ title.synopsis }}</p>
          <div class="actions">
            <button class="btn btn-primary">▶ Play</button>
            <button class="btn" @click="toggle(title.id)">
              {{ has(title.id) ? '✓ In My List' : '+ My List' }}
            </button>
            <button class="btn">👍 Rate</button>
            <button class="btn">⇪ Share</button>
          </div>
          <div class="credits">
            <p><span>Cast:</span> {{ title.cast.join(', ') }}</p>
            <p><span>Genres:</span> {{ title.genres.join(', ') }}</p>
            <p><span>Director:</span> {{ title.director }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="episodes.length" class="episodes container-x">
      <h2>Episodes · Season 1</h2>
      <ul>
        <li v-for="ep in episodes" :key="ep.n">
          <div class="ep-num">{{ ep.n }}</div>
          <div class="ep-thumb" :style="{ background: title.color }">
            <span>▶</span>
          </div>
          <div class="ep-body">
            <div class="ep-head">
              <h3>{{ ep.title }}</h3>
              <span>{{ ep.dur }}</span>
            </div>
            <p>An episode-length glimpse into the world of {{ title.name }}.</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="similar">
      <Row heading="More Like This" :titles="recs" />
    </section>
  </main>
  <main v-else class="empty container-x">
    <h2>Title not found</h2>
    <button class="btn btn-primary" @click="router.push('/')">Back to Home</button>
  </main>
</template>

<style scoped>
.banner {
  position: relative;
  min-height: 80vh;
  padding: 110px 0 60px;
  background: var(--title-color);
}
.banner-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13,13,18,0.3) 0%, rgba(13,13,18,0.65) 60%, rgba(13,13,18,1) 100%),
    linear-gradient(90deg, rgba(13,13,18,0.6) 0%, rgba(13,13,18,0.0) 65%);
}
.banner-inner {
  position: relative;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: start;
}
.back {
  position: absolute;
  top: 76px; left: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  z-index: 4;
}
.back:hover { background: rgba(255,255,255,0.1); }
.poster-side { position: sticky; top: 100px; }
.poster-art {
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.poster-glyph {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  font-size: 9rem; font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
}
.kicker {
  display: inline-block;
  font-size: 0.78rem; letter-spacing: 0.32em; font-weight: 700;
  color: var(--accent);
}
.info-side h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 8px 0;
  line-height: 1;
}
.tag { font-style: italic; color: rgba(255,255,255,0.8); margin: 0 0 14px; }
.meta {
  display: flex; gap: 12px; align-items: center;
  margin-bottom: 16px; font-size: 0.92rem; color: rgba(255,255,255,0.8);
}
.match { color: #4ade80; font-weight: 800; }
.rating-pill {
  border: 1px solid rgba(255,255,255,0.4);
  padding: 1px 8px; border-radius: 4px; font-size: 0.78rem;
}
.synopsis { max-width: 680px; line-height: 1.6; font-size: 1.05rem; margin: 0 0 22px; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 26px; }
.credits { display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: rgba(255,255,255,0.72); }
.credits span { color: var(--muted); margin-right: 6px; }

.episodes { padding: 32px 24px 20px; }
.episodes h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 18px; }
.episodes ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.episodes li {
  display: grid;
  grid-template-columns: 32px 180px 1fr;
  gap: 18px; align-items: center;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  transition: background 0.15s;
  cursor: pointer;
}
.episodes li:hover { background: rgba(255,255,255,0.05); }
.ep-num { font-size: 1.4rem; color: var(--muted); font-weight: 800; text-align: center; }
.ep-thumb {
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  display: grid; place-items: center;
  font-size: 1.3rem; color: rgba(255,255,255,0.7);
}
.ep-head { display: flex; justify-content: space-between; align-items: center; }
.ep-head h3 { margin: 0; font-size: 1rem; font-weight: 700; }
.ep-head span { color: var(--muted); font-size: 0.9rem; }
.ep-body p { margin: 6px 0 0; color: var(--muted); font-size: 0.88rem; }

.similar { padding-bottom: 60px; }

.empty { padding: 200px 24px; text-align: center; }
.empty h2 { margin-bottom: 18px; }

@media (max-width: 820px) {
  .banner-inner { grid-template-columns: 1fr; }
  .poster-side { position: static; max-width: 200px; }
  .episodes li { grid-template-columns: 28px 130px 1fr; gap: 10px; }
}
</style>
