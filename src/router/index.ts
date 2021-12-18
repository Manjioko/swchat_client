import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      index: 0,
      keepAlive: true,
    },
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      index: 1,
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
      index: 2,
      keepAlive: true,
    },
    component: () => import('../page/chatView/chatview.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
