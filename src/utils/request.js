import axios from 'axios'
import Vue from 'vue'
import {
  Notify,
  Dialog,
  Toast
} from 'vant'
Vue.use(Notify)
Vue.use(Dialog)
Vue.use(Toast)
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8;image/jpeg'

const service = axios.create({

  baseURL: process.env.VUE_APP_BASE_API,

  timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    config.headers['Accept'] = "application/json;charset=utf-8";
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
    const code = res.data.code
    if (code === 401) {
      Dialog.confirm({
        title: '登录异常',
        message: '重新登录',
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code !== 200) {

      if (res.data.msg !== null) {
        Toast.fail(res.data.msg);
      }

      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {

    Notify({
      type: 'warning',
      message: error.message
    });
    return Promise.reject(error)
  }
)

export default service
