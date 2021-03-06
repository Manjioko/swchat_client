import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    meta: {
      index: 0,
      keepAlive: true,
    },
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      index: 1,
      keepAlive: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      index: 2,
      keepAlive: true,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/chatview',
    name: 'ChatView',
    meta: {
      index: 3,
      keepAlive: true,
    },
    component: () => import('../page/chatView/chatview.vue')
  },
  {
    path: '/getfriend',
    name: 'GetFriend',
    meta: {
      index: 4,
      keepAlive: true,
    },
    component: () => import('../page/getFriend/getfriend.vue')
  },
  {
    path: '/remarkfriend',
    name: 'RemarkFriend',
    meta: {
      index: 5,
      keepAlive: true,
    },
    component: () => import('../page/remark/remark.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
