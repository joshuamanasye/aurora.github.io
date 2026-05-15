import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/Pages/Home.vue'
import Browse from '@/Pages/Browse.vue'
import TitleDetail from '@/Pages/TitleDetail.vue'
import MyList from '@/Pages/MyList.vue'
import Search from '@/Pages/Search.vue'
import Profile from '@/Pages/Profile.vue'
import Login from '@/Pages/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/browse/:category?', name: 'Browse', component: Browse },
    { path: '/title/:id', name: 'TitleDetail', component: TitleDetail },
    { path: '/my-list', name: 'MyList', component: MyList },
    { path: '/search', name: 'Search', component: Search },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
