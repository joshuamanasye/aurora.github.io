<script setup lang="ts">
import { ref } from 'vue'
import type { Title } from '@/model/title'
import PosterCard from './PosterCard.vue'

defineProps<{ heading: string; titles: Title[]; ranked?: boolean }>()

const scroller = ref<HTMLElement | null>(null)

function scroll(dir: 1 | -1) {
  if (!scroller.value) return
  scroller.value.scrollBy({ left: dir * scroller.value.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <section class="row">
    <div class="row-head container-x">
      <h2>{{ heading }}</h2>
    </div>
    <div class="row-wrap">
      <button class="nav left" @click="scroll(-1)" aria-label="scroll left">‹</button>
      <div class="scroller" ref="scroller">
        <div class="track">
          <PosterCard
            v-for="(t, i) in titles"
            :key="t.id"
            :title="t"
            :rank="ranked ? i + 1 : undefined"
          />
        </div>
      </div>
      <button class="nav right" @click="scroll(1)" aria-label="scroll right">›</button>
    </div>
  </section>
</template>

<style scoped>
.row { margin: 36px 0; }
.row-head { margin-bottom: 14px; }
.row-head h2 {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.row-wrap { position: relative; }
.scroller {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 30px 24px 30px;
  max-width: 1400px;
  margin: 0 auto;
}
.scroller::-webkit-scrollbar { display: none; }
.track {
  display: flex;
  gap: 12px;
  width: max-content;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 64px;
  border: none;
  background: rgba(10,10,20,0.55);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 2rem;
  border-radius: 8px;
  z-index: 4;
  opacity: 0.85;
}
.nav:hover { background: rgba(10,10,20,0.85); }
.nav.left { left: 6px; }
.nav.right { right: 6px; }
@media (max-width: 700px) {
  .nav { display: none; }
}
</style>
