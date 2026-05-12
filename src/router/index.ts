import { createRouter, createWebHistory } from 'vue-router'

import Homepage from '@/Pages/homepage.vue'
import SongDetail from '@/Pages/song_detail.vue'
import MusicVideo from '@/Pages/music_video.vue'
import MusicVideoDetail from '@/Pages/music_video_detail.vue'
import Profile from '@/Pages/profile.vue'
import Login from '@/Pages/login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ✅ GUEST / DEFAULT ROUTE
    {
      path: '/',
      name: 'GuestHome',
      component: Homepage
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    // ✅ USER ROUTES (optional username)
    {
      path: '/:usn?',
      children: [
        {
          path: '',
          name: 'Homepage',
          component: Homepage
        },
        {
          path: 'music',
          name: 'Music',
          component: MusicVideo
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile
        }
      ]
    },

    // ❗ keep detail routes OUTSIDE layout
    {
      path: '/song/:id/:usn?',
      name: 'SongDetail',
      component: SongDetail
    },
    {
      path: '/video/:id/:usn?',
      name: 'MusicVideoDetail',
      component: MusicVideoDetail
    }
  ]
})

export default router