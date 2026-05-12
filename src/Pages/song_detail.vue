<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { songs } from '../data/songs'
import type { SongData } from '../model/songData'
import { ref, computed, watch } from 'vue'
import { Play, Pause, Volume2, SkipForward, SkipBack} from 'lucide-vue-next'

const audioRef = ref<HTMLAudioElement | null>(null)

const route = useRoute()
const router = useRouter()

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)

// SONG NAVIGATION
const songId = computed(() => Number(route.params.id))

const currentIndex = computed(() =>
  songs.findIndex((s) => s.id === songId.value)
)

const song = computed(() => songs[currentIndex.value])

const nextSong = () => {
  const next = (currentIndex.value + 1) % songs.length
  const nextItem = songs[next]

  if (!nextItem) return

  router.push({ name: 'SongDetail', params: { id: nextItem.id } })
}

const prevSong = () => {
  const prev = (currentIndex.value - 1 + songs.length) % songs.length
  const prevItem = songs[prev]

  if (!prevItem) return

  router.push({ name: 'SongDetail', params: { id: prevItem.id } })
}
// SONG NAVIGATION

//AUTO PLAY SONG
watch(song, async () => {
  if (audioRef.value) {
    audioRef.value.load()

    try {
      await audioRef.value.play()
    } catch (err) {
      console.log('Autoplay blocked by browser')
    }
  }
})
//AUTO PLAY SONG

//CONTROLS
const updateTime = () => {
  if (!audioRef.value) return
  currentTime.value = audioRef.value.currentTime
}

const setDuration = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

const togglePlay = async () => {
  if (!audioRef.value) return

  if (audioRef.value.paused) {
    try {
      await audioRef.value.play()
      isPlaying.value = true 
    } catch (err) {
      console.log('Play failed')
    }
  } else {
    audioRef.value.pause()
    isPlaying.value = false 
  }
}

const seek = (event: Event) => {
  if (!audioRef.value) return

  const input = event.target as HTMLInputElement
  const value = Number(input.value)

  audioRef.value.currentTime = value
  currentTime.value = value
}

const changeVolume = (event: Event) => {
  if (!audioRef.value) return

  const input = event.target as HTMLInputElement
  const value = Number(input.value)

  volume.value = value
  audioRef.value.volume = value
}

  // WATCHER
watch(song, async () => {
  if (audioRef.value) {
    audioRef.value.load()

    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch {
      isPlaying.value = false
    }
  }
})

const formatTime = (time: number) => {
  if (!time) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

let animationFrame: number

const smoothUpdate = () => {
  if (audioRef.value && isPlaying.value) {
    currentTime.value = audioRef.value.currentTime
    animationFrame = requestAnimationFrame(smoothUpdate)
  }
}
////CONTROLS

//IMAGE ZOOM
const isFullscreen = ref(false)
const zoom = ref(1)

const openFullscreen = () => {
  isFullscreen.value = true
}

const closeFullscreen = () => {
  isFullscreen.value = false
  zoom.value = 1
}

const zoomIn = () => {
  if (zoom.value < 2) { 
    zoom.value += 0.2
  }
}

const zoomOut = () => {
  if (zoom.value > 0.4) zoom.value -= 0.2
}
//IMAGE ZOOM

// ROUTE TO MV
const goToVideo = () => {
  router.push({
    name: 'MusicVideoDetail',
    params: { id: song.value?.id }
  })
}
// ROUTE TO MV

// BACK TO HOME
const goBack = () => {
  router.push({
    name: 'Homepage',
    params: { usn: route.params.usn }
  })
}
// BACK TO HOME
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-6
              !bg-gradient-to-b from-stone-200 to-stone-300
              dark:from-gray-900 dark:to-gray-800 transition-colors">

    <!-- MAIN CONTENT -->
    <div
      v-if="song"
      class="!bg-white dark:!bg-gray-800 card border-0 
            shadow-lg overflow-hidden w-100"
      style="max-width: 760px; border-radius: 24px;">

      <!-- TOP SECTION -->
      <div class="card-body p-5">

        <!-- SONG TITLE -->
        <h1
          class="card-title fw-bold text-center mb-4
                !text-dark dark:!text-white"
          style="font-size: 2rem;">
          {{ song.title }}
        </h1>

        <!-- COVER -->
        <div class="d-flex justify-content-center mb-4">

          <img
            :src="song.cover"
            @click="openFullscreen"
            class="shadow cursor-pointer"
            style="
              width: 260px;
              height: 260px;
              object-fit: cover;
              border-radius: 20px;
              transition: 0.3s;"/>
        </div>

        <!-- INFO -->
        <div
          class="rounded-4 p-3 mb-4
                !bg-light dark:!bg-gray-700">

          <div class="d-flex justify-content-between">
            <span class="fw-semibold !text-dark dark:!text-white">
              Artist
            </span>

            <span class="text-secondary dark:!text-gray-300">
              {{ song.artist }}
            </span>
          </div>

          <hr class="my-2">

          <div class="d-flex justify-content-between">
            <span class="fw-semibold !text-dark dark:!text-white">
              Album
            </span>

            <span class="text-secondary dark:!text-gray-300">
              {{ song.album }}
            </span>
          </div>
        </div>

        <!-- AUDIO -->
        <audio
          ref="audioRef"
          autoplay
          :src="song.audio"
          @ended="nextSong"
          @timeupdate="updateTime"
          @loadedmetadata="setDuration"
          @play="isPlaying = true"
          @pause="isPlaying = false">
        </audio>

        <!-- AUDIO CONTROLS -->
        <div class="flex flex-col items-center gap-4 mb-4">

        <!-- CONTROLS BUTTON -->
        <div class="flex items-center justify-center gap-6">

          <!-- PREVIOUS -->
          <button
            @click="prevSong"
            class="p-2 rounded-full !bg-light dark:!bg-gray-700 transition 
                  !text-black dark:!text-white hover:scale-120">
            <SkipBack />
          </button>

          <!-- PLAY / PAUSE -->
          <button
            @click="togglePlay"
            class="w-16 h-16 !bg-blue-500 dark:!bg-gray-700 text-white rounded-full shadow-lg 
                  flex items-center justify-center
                  hover:scale-110 active:scale-95 transition">

            <Play v-if="!isPlaying" :size="28" />
            <Pause v-else :size="28" />

          </button>

          <!-- NEXT -->
          <button
            @click="nextSong"
            class="p-2 rounded-full !bg-light dark:!bg-gray-700 transition 
                  !text-black dark:!text-white hover:scale-120">
            <SkipForward/>
          </button>
        </div>

        <!-- PROGRESS -->
        <div class="w-full flex flex-col gap-1">

          <input
            type="range"
            min="0"
            :max="duration"
            :value="currentTime"
            @input="seek"
            class="w-full h-2 rounded-lg appearance-none cursor-pointer progress-bar"
            :style="{
              '--value': currentTime,
              '--max': duration
            }"
          />

          <div class="flex justify-between text-xs !text-black dark:!text-white">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- VOLUME -->
        <div class="flex items-center gap-2 !text-black dark:!text-white">
          <Volume2 :size="18" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="changeVolume"
            class="w-24"
          />
        </div>
      </div>
    </div>
  </div>

    <!-- ACTION BUTTONS -->
    <div class="mt-5 flex gap-4 mb-3">
      <button 
        @click="goBack"
        class="px-4 py-2 !bg-gray-300 dark:!bg-gray-700 
               !text-black dark:!text-white rounded-lg 
               hover:scale-105 transition">
        ⬅ Back
      </button>
      <button 
        @click="goToVideo"
        class="px-4 py-2 !bg-blue-400 !text-white rounded-lg 
               hover:scale-105 transition">
        🎥 Watch MV
      </button>
    </div>

    <!-- SONG LIST -->
    <div class=" w-xl !bg-stone-200 dark:!bg-gray-800
                 rounded-3xl shadow-xl p-4
                 max-h-80 overflow-y-auto
                 space-y-3">
      <div
        v-for="s in songs"
        :key="s.id"
        @click="router.push({ name: 'SongDetail', params: { id: s.id } })"
        :class="[
          'flex items-center gap-3 p-3 mt-2 rounded-xl cursor-pointer transition',
          s.id === song?.id
            ? '!bg-blue-400 !text-white'
            : '!bg-gray-100 dark:!bg-gray-800 hover:!bg-gray-200 dark:hover:!bg-gray-700'
        ]"
      >
        <img :src="s.cover" class="w-12 rounded-md" />
        <div>
          <p class="font-medium !text-black dark:!text-white">{{ s.title }}</p>
          <p class="text-xs opacity-70 !text-black dark:!text-white">{{ s.artist }}</p>
        </div>
      </div>
    </div>

    <!-- FULLSCREEN OVERLAY (ZOOM) -->
    <div 
      v-if="isFullscreen"
      class="fixed inset-0 !bg-black/90 flex flex-col items-center justify-center">
      <img 
        :src="song?.cover"
        :style="{ transform: `scale(${zoom})` }"
        class="max-w-[80%] max-h-[70%] transition"/>
      <div class="absolute bottom-10 flex gap-3">
        <button class="px-3 py-2 !bg-white rounded" @click="zoomIn">+</button>
        <button class="px-3 py-2 !bg-white rounded" @click="zoomOut">-</button>
        <button class="px-3 py-2 !bg-white rounded" @click="closeFullscreen">Close</button>
      </div>
    </div>

    <!-- IF SONG NOT FOUND -->
    <div v-else-if="!song" class="mt-10 !text-gray-600 dark:!text-gray-400">
      <p>Song not found</p>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 calc((var(--value, 0) / var(--max, 1)) * 100%),
    #d1d5db calc((var(--value, 0) / var(--max, 1)) * 100%),
    #d1d5db 100%
  );
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  height: 14px;
  width: 14px;
  background: white;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  cursor: pointer;
  transition: 0.2s;
}

.progress-bar::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}
</style>