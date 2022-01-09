export default [{
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ 'views/user/Login.vue'),
    meta: {
      title: '登录'
    }
  },

]
