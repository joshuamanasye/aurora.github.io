import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const saved = localStorage.getItem('userProfile')

const html = document.documentElement

if (saved) {
  const parsed = JSON.parse(saved)

  if (parsed.theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
} else {
  html.classList.remove('dark')
}

createApp(App)
  .use(router)
  .mount('#app')

