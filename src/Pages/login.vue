<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  if (!username.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }

  const existingData = localStorage.getItem('userProfile')

  let parsed = {
    username: '',
    theme: 'light',
    profileImage: null
  }

  if (existingData) {
    parsed = JSON.parse(existingData)
  }

  localStorage.setItem(
    'userProfile',
    JSON.stringify({
      ...parsed,
      username: username.value
    })
  )

  window.dispatchEvent(new Event('profileUpdated'))

  router.push({
    name: 'Homepage'
  })
}
</script>


<template>
  <div
    class="min-h-screen flex items-center justify-center
           py-6 px-10
           bg-gradient-to-br from-gray-100 to-gray-300
           dark:from-gray-900 dark:to-gray-950"
  >
    
    <!-- HEADER -->
    <div
      class="w-200 max-w-md !bg-white dark:!bg-gray-800
             rounded-3xl"
    >
      <div class="mb-8 text-center mt-2">
        <h1 class="text-3xl font-bold !text-gray-800 dark:!text-white">
          Login
        </h1>

        <p class="!text-gray-500 dark:!text-gray-400 mt-2">
          Sign in to continue
        </p>
      </div>

      <!-- USERNAME -->
      <div class="space-y-8">
        <div>
          <label class="block mb-2 text-sm !text-gray-600 dark:!text-gray-300">
            Username
          </label>

          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            class="w-full px-4 py-3 rounded-xl border mb-4
                   !bg-white dark:!bg-gray-700
                   border-black !text-gray-800 dark:!text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- PASSWORD -->
        <div space-y-3>
          <label class="block mb-2 text-sm !text-gray-600 dark:!text-gray-300 ">
            Password
          </label>

          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full px-4 py-3 rounded-xl border mb-4
                   !bg-white dark:!bg-gray-700
                   border-black !text-gray-800 dark:!text-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- ERROR MESSAGE -->
        <p
          v-if="error"
          class="!text-red-500 text-sm"
          >
          {{ error }}
        </p>

        <!-- LOGIN BUTTON -->
        <button
          @click="login"
          class="w-full py-3 rounded-xl
                 !bg-blue-500 hover:!bg-blue-600
                 text-white font-medium
                 transition rounded"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>