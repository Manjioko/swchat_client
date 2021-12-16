import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import swallowUI from 'swallow-ui'

Vue.use(swallowUI)
console.log(swallowUI)

Vue.config.productionTip = false


Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
