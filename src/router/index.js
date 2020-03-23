import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chords',
    name: 'chords',
    component: () => import('../views/Chords.vue')
  },
  {
    path: '/midi',
    name: 'midi',
    component: () => import('../views/Midi.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
