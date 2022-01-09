import Vue from 'vue'
import 'lib-flexible'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'utils/permission'


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
