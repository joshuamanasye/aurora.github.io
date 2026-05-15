<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Title } from '@/model/title'
import { useMyList } from '@/composables/useMyList'

const props = defineProps<{ title: Title; rank?: number }>()
const router = useRouter()
const { has, toggle } = useMyList()

function open() {
  router.push({ name: 'TitleDetail', params: { id: props.title.id } })
}
function onAdd(e: MouseEvent) {
  e.stopPropagation()
  toggle(props.title.id)
}
</script>

<template>
  <div class="poster" :class="{ ranked: rank != null }" @click="open">
    <span v-if="rank != null" class="rank-num">{{ rank }}</span>
    <div class="art" :style="{ background: title.color }">
      <div class="glyph">{{ title.glyph }}</div>
      <div class="overlay">
        <div class="meta-top">
          <span class="match">{{ title.match }}% Match</span>
          <span class="dot">·</span>
          <span>{{ title.year }}</span>
        </div>
        <h4 class="title-name">{{ title.name }}</h4>
        <div class="meta-bot">
          <span class="badge">{{ title.rating }}</span>
          <span>{{ title.runtime }}</span>
        </div>
        <div class="actions">
          <button class="play">▶ Play</button>
          <button class="add" :title="has(title.id) ? 'Remove from My List' : 'Add to My List'" @click="onAdd">
            {{ has(title.id) ? '✓' : '+' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poster {
  flex: 0 0 auto;
  width: 220px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.poster:hover { transform: translateY(-6px) scale(1.04); z-index: 5; }
.poster.ranked { width: 280px; padding-left: 70px; }

.rank-num {
  position: absolute;
  left: -10px;
  bottom: -20px;
  font-size: 9rem;
  font-weight: 900;
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 3px rgba(255, 255, 255, 0.8);
  letter-spacing: -0.05em;
  pointer-events: none;
  z-index: 1;
}

.art {
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 7rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px;
  background: linear-gradient(180deg, transparent 35%, rgba(0, 0, 0, 0.82) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.poster:hover .overlay { opacity: 1; }

.meta-top { display: flex; gap: 6px; align-items: center; font-size: 0.78rem; }
.match { color: #4ade80; font-weight: 700; }
.dot { opacity: 0.4; }

.title-name { margin: 6px 0 4px; font-size: 1rem; font-weight: 800; }

.meta-bot { display: flex; gap: 8px; align-items: center; font-size: 0.78rem; color: rgba(255, 255, 255, 0.75); }
.badge {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.actions { display: flex; gap: 8px; margin-top: 10px; }
.play {
  border: none;
  font-weight: 800;
  border-radius: 6px;
  padding: 6px 12px;
  background: #fff;
  color: #0d0d12;
  font-size: 0.82rem;
}
.add {
  width: 32px;
  padding: 6px 0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1rem;
}
.add:hover { background: rgba(255, 255, 255, 0.28); }
</style>
