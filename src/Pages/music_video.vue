<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, type InputHTMLAttributes } from 'vue';
import type { SongData } from '../model/songData';
import { songs } from '../data/songs';
import { Pause, Play, Route, Volume2, VolumeOff } from 'lucide-vue-next';
  
const route = useRoute()
const router = useRouter()

const username = route.params.usn
const songslist = ref<SongData[]>(songs)

//SELECT VIDEO
const selectSong = (song: SongData) => {
  router.push({
    name: 'MusicVideoDetail',
    params: { id: song.id, usn: username}
  })
}
// SELECT VIDEO
</script>

<template> 
  <main class="min-h-screen flex flex-col items-center p-6
               bg-gradient-to-b from-stone-200 to-stone-300
               dark:from-gray-900 dark:to-gray-800 transition-colors">

    <!-- HEADER -->
    <div class="w-full max-w-5xl mb-6">
      <p class="text-3xl text-center text-gray-600 dark:text-white mt-1">
        Music Videos
      </p>
    </div>

    <!-- MV LIST -->
    <div class="w-full max-w-5xl overflow-x-auto">
      <div class="flex gap-6 pb-3">
        <div
          v-for="song in songslist"
          :key="song.id"
          @click="selectSong(song)"
          class="flex-shrink-0 w-44 p-3 rounded-xl cursor-pointer transition
                 bg-white/70 dark:bg-gray-800 backdrop-blur shadow-sm
                 hover:shadow-md hover:scale-105"
        >
          <!-- COVER -->
          <img 
            :src="song.cover"
            :alt="song.title"
            class="w-full h-32 object-cover rounded-md mb-2"
          />

          <!-- INFO -->
          <p class="font-medium text-gray-800 dark:text-white text-center">
            {{ song.title }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            {{ song.artist }}
          </p>
        </div>

      </div>
    </div>

  </main>
</template>