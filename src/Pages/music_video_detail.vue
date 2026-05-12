<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { songs } from '../data/songs'
import type { SongData } from '../model/songData'
import { computed, ref, watch } from 'vue'
import { Play, Pause, Volume2, SkipForward, SkipBack, Fullscreen} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)

// MV NAVIGATION
const songId = computed(() => Number(route.params.id))
const username = route.query.usn   
const videoRef = ref<HTMLVideoElement | null>(null)


const currentIndex = computed(() =>
  songs.findIndex((s) => s.id === songId.value)
)

const song = computed(() => songs[currentIndex.value])

const nextMV = () => {
  const next = (currentIndex.value + 1) % songs.length
  const nextItem = songs[next]

  if (!nextItem) return

  router.push({ name: 'MusicVideoDetail', params: { id: nextItem.id } })
}

const prevMV = () => {
  const prev = (currentIndex.value - 1 + songs.length) % songs.length
  const prevItem = songs[prev]

  if (!prevItem) return

  router.push({ name: 'MusicVideoDetail', params: { id: prevItem.id } })
}
// MV NAVIGATION

// AUTO PLAY MV
watch(song, async () => {
  if (videoRef.value) {
    videoRef.value.load()

    try {
      await videoRef.value.play()
    } catch (err) {
      console.log('Autoplay blocked by browser')
    }
  }
})
// AUTO PLAY MV

//CONTROLS
const updateTime = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
}

const setDuration = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

const togglePlay = async () => {
  if (!videoRef.value) return

  if (videoRef.value.paused) {
    try {
      await videoRef.value.play()
      isPlaying.value = true
    } catch {}
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

const seek = (e: Event) => {
  if (!videoRef.value) return
  const value = Number((e.target as HTMLInputElement).value)
  videoRef.value.currentTime = value
  currentTime.value = value
}

const changeVolume = (e: Event) => {
  if (!videoRef.value) return
  const value = Number((e.target as HTMLInputElement).value)
  videoRef.value.volume = value
  volume.value = value
}

const toggleFullscreen = () => {
  if (!videoRef.value) return

  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const formatTime = (time: number) => {
  if (!time) return '0:00'
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
//CONTROLS

// ROUTE TO SONG
const goToSong = () => {
  router.push({
    name: 'SongDetail',
    params: { id: song.value?.id }
  })
}

// ROUTE TO MV

// BACK TO HOME
const goBack = () => {
  router.push({
    name: 'Music',
    query: { usn: username }
  })
}
// BACK TO HOME
</script>

<template>
  <div
    v-if="song"
    class="min-h-screen
           bg-gradient-to-b from-stone-200 to-stone-300
           dark:from-gray-900 dark:to-gray-800
           px-6 py-10">

    <!-- MAIN CONTAINER -->
    <div class="max-w-5xl mx-auto">

      <!-- VIDEO CARD -->
      <div
        class="!bg-white dark:!bg-gray-800
               rounded-3xl shadow-2xl
               overflow-hidden ">

        <!-- VIDEO -->
        <div class="p-5 ">
          <video
            ref="videoRef"
            autoplay
            :src="song.mv"
            :poster="song.cover"
            @ended="nextMV"
            @timeupdate="updateTime"
            @loadedmetadata="setDuration"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            class="w-full rounded-2xl shadow-lg">
          </video>
        </div>

        <!-- CONTENT -->
        <div class="px-8 pb-8">

          <!-- TITLE -->
          <div class="text-center mb-8">

            <h1
              class="text-4xl font-bold
                     !text-gray-800 dark:!text-white">
              {{ song.title }}
            </h1>
          </div>

          <!-- INFO CARD -->
          <div
            class="rounded-4 p-3 mb-4
                   !bg-light dark:!bg-gray-700">
            <div class="flex justify-between items-center">
              <span class="font-semibold !text-gray-700 dark:!text-white">
                Artist
              </span>
              <span class="!text-gray-500 dark:!text-gray-300">
                {{ song.artist }}
              </span>
            </div>
            <hr class="my-4 border-gray-300 dark:border-gray-600">
            <div class="flex justify-between items-center">
              <span class="font-semibold !text-gray-700 dark:!text-white">
                Album
              </span>
              <span class="!text-gray-500 dark:!text-gray-300">
                {{ song.album }}
              </span>
            </div>
          </div>

          <!-- CUSTOM VIDEO CONTROLS -->
          <div class="flex flex-col items-center gap-4 mt-4">

            <!-- BUTTON ROW -->
            <div class="flex items-center justify-center gap-6">

              <!-- PREV -->
              <button
                @click="prevMV"
                class="p-2 rounded-full !bg-light dark:!bg-gray-700 transition 
                  !text-black dark:!text-white hover:scale-120">
                <SkipBack />
              </button>

              <!-- PLAY -->
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
                @click="nextMV"
                class="p-2 rounded-full !bg-light dark:!bg-gray-700 transition 
                  !text-black dark:!text-white hover:scale-120">
                <SkipForward/>
              </button>

              <!-- FULLSCREEN -->
              <button
                @click="toggleFullscreen"
                class="p-2 rounded-full !bg-light dark:!bg-gray-700 transition 
                  !text-black dark:!text-white hover:scale-120">
                <Fullscreen />
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
                }"/>

              <div class="flex justify-between text-xs !text-black dark:!text-white">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration) }}</span>
              </div>
            </div>

            <!-- VOLUME -->
            <div class="flex items-center gap-2 !text-black dark:!text-white mb-4">
              <volume2 />
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
      <div class="flex justify-center gap-4 mt-5">
        <button
          @click="goBack"
          class="px-5 py-3 rounded-xl
                  !bg-white dark:!bg-gray-700
                  !text-gray-800 dark:!text-white
                  hover:scale-105 transition">
          ⬅ Back
        </button>
        <button
          @click="goToSong"
          class="px-5 py-3 rounded-xl
                  !bg-purple-500 hover:!bg-purple-600
                  !text-white
                  hover:scale-105 transition">
            Song Page
        </button>
        </div>

      <!-- MV LIST -->
      <div class="mt-5">
        <h2
          class="text-2xl font-bold mb-10
                 !text-gray-800 dark:!text-white">
          More Videos
        </h2>
        <div
          class="!bg-stone-200 dark:!bg-gray-800
                 rounded-3xl shadow-xl p-4
                 max-h-80 overflow-y-auto
                 space-y-3">
          <div
            v-for="s in songs"
            :key="s.id"
            @click="router.push({ name: 'MusicVideoDetail', params: { id: s.id } })"
            :class="[
              'flex items-center mt-2 gap-4 p-3 rounded-2xl cursor-pointer transition',
              s.id === song.id
                ? '!bg-blue-500 !text-white'
                : '!bg-white-200 dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700'
            ]">
            <img
              :src="s.cover"
              class="w-16 h-16 rounded-xl object-cover shadow"/>
            <div>
              <p class="font-semibold !text-black dark:!text-white">
                {{ s.title }}
              </p>
              <p class="text-sm opacity-70 !text-black dark:!text-white">
                {{ s.artist }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- NOT FOUND -->
  <div
    v-else
    class="min-h-screen flex items-center justify-center
           !bg-gray-100 dark:!bg-gray-900"
  >
    <p class="text-xl !text-gray-500 dark:!text-gray-400">
      Video not found
    </p>
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