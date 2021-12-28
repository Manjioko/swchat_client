import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import swallowUI from 'swallow-ui'
import ApiUrl from './utils/apiUrl'
// import websocket from './websocket/websocketConfig'
import websocketListener from './websocket/websocketListener'
const axios = require('axios').default
Vue.config.productionTip = false


Vue.use(swallowUI)
// Vue.use(websocket(new ApiUrl().rootUrl))


Vue.prototype.$bus = new Vue()
Vue.prototype.$api = new ApiUrl()
Vue.prototype.$axios = axios

let vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// websocket监听文件
websocketListener(vm)