<script setup lang="ts">
import { computed, ref } from 'vue' // 🌟 Added ref for handling popup state
import { useRoute, useRouter } from 'vue-router'
import { getTitle, recommendations } from '@/data/titles'
import { useMyList } from '@/composables/useMyList'
import Row from '@/components/Row.vue'

const route = useRoute()
const router = useRouter()
const { has, toggle } = useMyList()

// 🌟 Modal player toggle state variables
const isPlaying = ref(false)

const getAssetUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('/@fs')) return path
  const filename = path.split('/').pop()
  return new URL(`../assets/movies/${filename}`, import.meta.url).href
}

const title = computed(() => getTitle(String(route.params.id)))
const recs = computed(() => (title.value ? recommendations(title.value.id) : []))

// 🌟 Converts standard watch links into responsive embedded player URLs
const embedTrailerUrl = computed(() => {
  if (!title.value?.trailer) return ''
  let url = title.value.trailer

  // Convert normal YouTube watch links (youtube.com/watch?v=XYZ) to embed links (youtube.com/embed/XYZ)
  if (url.includes('youtube.com/watch?v=')) {
    url = url.replace('youtube.com/watch?v=', 'youtube.com/embed/')
  } else if (url.includes('youtu.be/')) {
    url = url.replace('youtu.be/', 'youtube.com/embed/')
  }
  
  // Appends autoplay command parameters so it starts right up when opened
  return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
})

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
    <section class="banner" :style="{ backgroundImage: `url(${getAssetUrl(title.image)})` }">
      <button class="back" @click="router.back()">‹ Back</button>
      <div class="banner-shade" />
      <div class="banner-inner container-x">
        <div class="poster-side">
          <div class="poster-art">
            <img :src="getAssetUrl(title.image)" :alt="title.name" class="detail-poster-img" />
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
            <!-- 🌟 ALTERED: Changed from an <a> tag link to a click-triggered event button -->
            <button class="btn btn-primary" @click="isPlaying = true">▶ Play</button>
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

    <!-- 🌟 NEW: Overlaid Popup Player Shell -->
    <div v-if="isPlaying" class="video-overlay" @click.self="isPlaying = false">
      <div class="video-modal">
        <button class="close-video" @click="isPlaying = false">✕ Close</button>
        <div class="video-responsive-container">
          <iframe 
            :src="embedTrailerUrl" 
            title="Trailer Video Player"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <section v-if="episodes.length" class="episodes container-x">
      <h2>Episodes · Season 1</h2>
      <ul>
        <!-- 🌟 ALTERED: Clicking an episode item row opens the main layout video player popup too -->
        <li v-for="ep in episodes" :key="ep.n" @click="isPlaying = true">
          <div class="ep-num">{{ ep.n }}</div>
          <div class="ep-thumb">
            <img :src="getAssetUrl(title.image)" :alt="ep.title" class="ep-thumb-img" />
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
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.banner-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13,13,18,0.5) 0%, rgba(13,13,18,0.8) 60%, rgba(13,13,18,1) 100%),
    linear-gradient(90deg, rgba(13,13,18,0.8) 0%, rgba(13,13,18,0.2) 65%);
  z-index: 1;
}
.banner-inner {
  position: relative;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 48px;
  align-items: start;
  z-index: 2;
}
.back {
  position: absolute;
  top: 76px; left: 24px;
  background: rgba(30, 30, 40, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  z-index: 4;
}
.back:hover { background: rgba(255,255,255,0.2); }
.poster-side { position: sticky; top: 100px; }
.poster-art {
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: #1e1e1e;
}
.detail-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 2;
}
.poster-glyph {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  font-size: 9rem; font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  z-index: 1;
}
.kicker {
  display: inline-block;
  font-size: 0.78rem; letter-spacing: 0.32em; font-weight: 700;
  color: #e50914;
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
.actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 26px; }

/* Main primary style setup for standard buttons */
.btn-primary {
  background-color: #fff;
  color: #000;
  font-weight: bold;
  border: none;
  cursor: pointer;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1rem;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.85; }

/* 🌟 NEW: CSS styling configs for overlay glass layer and sizing wrappers */
.video-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 999; /* Higher priority layer stack than navigation header layers */
  padding: 24px;
}
.video-modal {
  width: 100%;
  max-width: 900px;
  background: #0d0d12;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}
.close-video {
  width: 100%;
  background: #141414;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-align: right;
  transition: color 0.15s;
}
.close-video:hover { color: #fff; }
.video-responsive-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Perfect 16:9 Cinema Aspect Ratio aspect-scaling box lock */
  height: 0;
}
.video-responsive-container iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
}

.credits { display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: rgba(255,255,255,0.72); }
.credits span { color: #888; margin-right: 6px; }

.episodes { padding: 32px 24px 20px; }
.episodes h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 18px; }
.episodes ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.episodes li {
  display: grid;
  grid-template-columns: 32px 180px 1fr;
  gap: 18px; align-items: center;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: #141414;
  transition: background 0.15s;
  cursor: pointer;
}
.episodes li:hover { background: rgba(255,255,255,0.05); }
.ep-num { font-size: 1.4rem; color: #555; font-weight: 800; text-align: center; }
.ep-thumb {
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: grid; place-items: center;
  font-size: 1.3rem; color: #fff;
  background: #222;
}
.ep-thumb span {
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}
.ep-thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  z-index: 1;
}
.ep-head { display: flex; justify-content: space-between; align-items: center; }
.ep-head h3 { margin: 0; font-size: 1rem; font-weight: 700; }
.ep-head span { color: #777; font-size: 0.9rem; }
.ep-body p { margin: 6px 0 0; color: #777; font-size: 0.88rem; }

.similar { padding-bottom: 60px; }

.empty { padding: 200px 24px; text-align: center; }
.empty h2 { margin-bottom: 18px; }

@media (max-width: 820px) {
  .banner-inner { grid-template-columns: 1fr; }
  .poster-side { position: static; max-width: 200px; }
  .episodes li { grid-template-columns: 28px 130px 1fr; gap: 10px; }
}
</style>