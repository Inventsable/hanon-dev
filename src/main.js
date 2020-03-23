import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


import Hanon from '@/components/Hanon'

Vue.component('Hanon', Hanon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
