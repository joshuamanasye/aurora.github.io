<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Title } from '@/model/title'
import { useMyList } from '@/composables/useMyList'

const props = defineProps<{ title: Title; rank?: number }>()
const router = useRouter()
const { has, toggle } = useMyList()

const bg = computed(() => {
  const [a, b, c] = props.title.gradient
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`
})

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
    <div class="art" :style="{ background: bg }">
      <div class="glyph">{{ title.glyph }}</div>
      <div class="grain" />
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
  transition: transform 0.25s ease, z-index 0s 0.25s;
}
.poster:hover { transform: translateY(-6px) scale(1.04); z-index: 5; transition: transform 0.25s ease, z-index 0s; }
.poster.ranked { width: 280px; padding-left: 70px; }
.rank-num {
  position: absolute;
  left: -10px;
  bottom: -20px;
  font-size: 9rem;
  font-weight: 900;
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 3px rgba(255,255,255,0.85);
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.05em;
  pointer-events: none;
  z-index: 1;
}
.art {
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  isolation: isolate;
}
.glyph {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 7rem;
  font-weight: 900;
  color: rgba(255,255,255,0.92);
  text-shadow: 0 6px 30px rgba(0,0,0,0.4);
  letter-spacing: -0.04em;
}
.grain {
  position: absolute; inset: 0;
  background:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.18) 0, transparent 50%),
    radial-gradient(1.5px 1.5px at 70% 80%, rgba(255,255,255,0.12) 0, transparent 50%),
    radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.08) 0, transparent 50%);
  mix-blend-mode: screen;
  opacity: 0.6;
}
.overlay {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 14px;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.poster:hover .overlay { opacity: 1; }
.meta-top { display: flex; gap: 6px; align-items: center; font-size: 0.78rem; color: #d2ffd2; }
.match { color: #4ade80; font-weight: 700; }
.dot { opacity: 0.5; }
.title-name {
  margin: 6px 0 4px;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.meta-bot { display: flex; gap: 8px; align-items: center; font-size: 0.78rem; color: rgba(255,255,255,0.8); }
.badge {
  border: 1px solid rgba(255,255,255,0.4);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}
.actions { display: flex; gap: 8px; margin-top: 10px; }
.play, .add {
  border: none;
  font-weight: 800;
  border-radius: 999px;
  padding: 6px 12px;
  background: #fff;
  color: #0a0a14;
}
.add {
  width: 32px; padding: 6px 0;
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
}
.add:hover { background: rgba(255,255,255,0.28); }
</style>
