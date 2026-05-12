<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { SongData } from '../model/songData';
import { songs } from '../data/songs';
import { ref } from 'vue';
  
const route = useRoute()
const router = useRouter()

const username = route.params.usn
const songslist = ref<SongData[]>(songs)

//SELECT SONG
const selectSong = (song: SongData) => {
  router.push({
    name: 'SongDetail',
    params: { id: song.id, usn: username}
  })
}
//SELECT SONG
</script>

<template>
  <div class="min-h-screen
            flex flex-col items-center
            bg-gradient-to-b from-stone-200 to-stone-300
            dark:from-gray-900 dark:to-gray-800 transition-colors">

  <!-- TOP CONTAINER -->
  <div class="w-full max-w-5xl px-6 pt-28 pb-20 flex flex-col gap-10">

    <!-- HEADER -->
    <div>
      <p class="text-[45px] text-gray-600 dark:text-white mt-3 mb-1">
        Songs
      </p>
    </div>

    <!-- SONG LIST -->
    <div class="flex flex-col gap-3">
      <div
        v-for="song in songslist"
        :key="song.id"
        @click="selectSong(song)"
        class="flex items-center gap-4 p-4 rounded-xl cursor-pointer
               bg-white/60 dark:bg-gray-800/60
               backdrop-blur
               border border-gray-200/40 dark:border-gray-700/40
               hover:shadow-md transition"
      >
        <!-- COVER -->
        <img
          :src="song.cover"
          class="w-30 h-30 rounded-lg object-cover"
        />
        <!-- INFO -->
        <div class="flex flex-col">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ song.title }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ song.artist }}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>