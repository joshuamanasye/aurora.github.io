<script  setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { CircleUser } from 'lucide-vue-next'

const username = ref('')
const theme = ref<'light' | 'dark'>('light')
const profileImage = ref<string | null>(null)
const loadingImage = ref(false)

const STORAGE_KEY = 'userProfile'

// LOAD DATA
onMounted(() => {
  const data = localStorage.getItem(STORAGE_KEY)

  if (data) {
    const parsed = JSON.parse(data)
    username.value = parsed.username || ''
    theme.value = parsed.theme || 'light'
    profileImage.value = parsed.profileImage || null
  }

  applyTheme()
})
// LOAD DATA

//APPLY & SAVE THEME CHANGE
watch(theme, (newTheme) => {
  applyTheme()
  saveProfile()
})

const applyTheme = () => {
  const html = document.documentElement
  html.classList.toggle('dark', theme.value === 'dark')
}
//APPLY & SAVE THEME CHANGE

//SAVE PROFILE
const saveProfile = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      username: username.value,
      theme: theme.value,
      profileImage: profileImage.value
    })
  )

  //UPDATE NAVBAR
  window.dispatchEvent(new Event('profileUpdated'))
}
//SAVE PROFILE

//UPLOAD IMAGE
const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 1024 * 1024) {
    alert('Image must be less than 1MB')
    return
  }

  loadingImage.value = true

  const reader = new FileReader()
  reader.onload = () => {
    profileImage.value = reader.result as string
    loadingImage.value = false
  }

  reader.readAsDataURL(file) 
}
//UPLOAD IMAGE
</script>

<template>
  <div class="min-h-screen px-4 py-10
              bg-gradient-to-b from-stone-200 to-stone-300
              dark:from-gray-900 dark:to-gray-800 
              transition-colors">

    <!-- CONTAINER -->
    <div class="max-w-2xl mx-auto">

      <!-- HEADER -->
      <div class="mb-8">
        <p class="text-3xl text-center text-gray-500 dark:text-white mt-1 mb-4">
          Profile
        </p>
      </div>

      <!-- CARD -->
      <div class="!bg-white dark:!bg-gray-800
                  rounded-2xl shadow-md p-6 space-y-6">

        <!-- PROFILE IMAGE -->
        <div class="relative">
          <div
            v-if="loadingImage"
            class="w-24 h-24 border-4 border-gray-300 border-t-blue-400
                  rounded-full animate-spin"
          ></div>

          <img
            v-else-if="profileImage"
            :src="profileImage"
            class="w-24 h-24 rounded-full object-cover shadow"
          />

          <div
            v-else
            class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700
                  flex items-center justify-center shadow"
          >
            <CircleUser class="w-16 h-16 text-gray-500 dark:text-gray-300" />
          </div>
        </div>

        <!-- UPLOAD PROFILE IMAGE -->
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2 mt-4">
            Change Avatar
          </label>
          
          <div><input 
            type="file"
            @change="handleImageUpload"
            class="text-sm text-gray-600 dark:text-gray-300
                    file:mr-3 file:px-3 file:py-1
                    file:rounded-md file:border-0
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600 transition"
            />
          </div>
        </div>

        <!-- USERNAME -->
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300 mt-4">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 rounded-lg border
                   bg-white dark:bg-gray-700
                   text-gray-800 dark:text-white
                   border-black dark:border-white
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        
        <!-- CONFIRM BUTTON -->
        <div>
          <button
            @click="saveProfile"
            class="btn btn-outline-primary px-4 mt-4 bg-white"
          >
            Confirm Changes
          </button>
        </div>

        <!-- THEME -->
        <div>
          <label class="block mb-1 text-sm text-gray-600 dark:text-gray-300 mt-4">
            Theme
          </label>

          <div class="flex gap-3">
            <button
              @click="theme = 'light'"
              :class="[
                'flex-1 py-2 rounded-lg border transition',
                theme === 'light'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-700 text-black dark:text-gray-300 border-gray-300 dark:border-gray-600'
              ]"
            >
              ☀️ Light
            </button>

            <button
              @click="theme = 'dark'"
              :class="[
                'flex-1 py-2 rounded-lg border transition',
                theme === 'dark'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-black border-gray-300 dark:border-gray-600'
              ]"
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>