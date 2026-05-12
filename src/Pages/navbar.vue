<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { CircleUser } from 'lucide-vue-next'

const router = useRouter()

const username = ref('Guest')
const profileImage = ref<string | null>(null)

//LOAD PROFILE
const loadProfile = () => {
  const data = localStorage.getItem('userProfile')

  if (!data) {
    username.value = 'Guest'
    profileImage.value = null
    return
  }

  const parsed = JSON.parse(data)

  username.value = parsed.username || 'Guest'
  profileImage.value = parsed.profileImage || null
}
//LOAD PROFILE

const logout = () => {
  localStorage.removeItem('userProfile')

  // RESET GUEST STATE
  username.value = 'Guest'
  profileImage.value = null

  // RESET THEME TO LIGHT
  document.documentElement.classList.remove('dark')

  // UPDATE PROFILE
  window.dispatchEvent(new Event('profileUpdated'))

  router.push('/login')
}

onMounted(() => {
  loadProfile()

  window.addEventListener('storage', loadProfile)
  window.addEventListener('profileUpdated', loadProfile)
})

onUnmounted(() => {
  window.removeEventListener('storage', loadProfile)
  window.removeEventListener('profileUpdated', loadProfile)
})
</script>

<template>
  <nav
    class="navbar navbar-dark bg-dark fixed-top shadow px-4"
  >

    <!-- LEFT SIDE -->
    <div class="d-flex align-items-center gap-4">

      <!-- LOGO -->
      <RouterLink
        :to="{ name: 'Homepage'}"
        class="navbar-brand fw-bold mb-0"
      >
        SpoJeDy
      </RouterLink>

      <!-- NAV LINKS -->
      <div class="d-flex gap-3">

        <RouterLink
          :to="{ name: 'Homepage' }"
          class="nav-link text-light"
        >
          Home
        </RouterLink>

        <RouterLink
          :to="{ name: 'Music' }"
          class="nav-link text-light"
        >
          Music Video
        </RouterLink>

        <RouterLink
          :to="{ name: 'Profile' }"
          class="nav-link text-light"
        >
          Profile
        </RouterLink>

      </div>
    </div>

    <!-- RIGHT SIDE -->
    <div class="d-flex align-items-center gap-3">

      <span class="text-light small">
        Hi, {{ username }}
      </span>

      <!-- PROFILE IMAGE -->
      <img
        v-if="profileImage"
        :src="profileImage"
        class="rounded-circle border border-primary object-fit-cover"
        style="
          width: 42px;
          height: 42px;
          object-fit: cover;
  "
      />
      <!-- DEFAULT ICON -->
      <CircleUser
        v-else
        class="text-primary border border-primary rounded-circle p-1"
        :size="42"
      />

      <!-- LOGOUT -->
      <button
      v-if="username !== 'Guest'"
      @click="logout"
      class="btn btn-outline-danger btn-sm"
    >
      Logout
    </button>

    <RouterLink
      v-else
      :to="{ name: 'Login' }"
      class="btn btn-outline-primary btn-sm"
    >
      Login
    </RouterLink>
    </div>

  </nav>
</template>
