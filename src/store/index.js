import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import createLoadingPlugin from 'utils/vuex-loading'
Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
console.log(modules, "modules")
console.log(user, "user")

const store = new Vuex.Store({
  plugins: [createLoadingPlugin()],
  state: {
    direction: 'forward' // 页面切换方向
  },
  getters: {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
  },
  // vuex 全局getters引入局部
  // token () {
  //   return store.getters['user/token']
  // }

  mutations: {
    // 更新页面切换方向
    updateDirection(state, direction) {
      state.direction = direction
    }
  },
  actions: {},
  modules
})
export default store
