import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import swallowUI from 'swallow-ui'
import ApiUrl from './utils/apiUrl'
import storageData from './utils/storageData'
import indexDB from './websocket/indexDBClass'
// import mqtt from './websocket/mqttClient'
// import websocket from './websocket/websocketConfig'
// import websocketListener from './websocket/websocketListener'
const axios = require('axios').default
Vue.config.productionTip = false


Vue.use(swallowUI)
// Vue.use(websocket(new ApiUrl().rootUrl))

Vue.prototype.$db = new indexDB()
Vue.prototype.$bus = new Vue()
Vue.prototype.$api = new ApiUrl()
Vue.prototype.$axios = axios
Vue.prototype.$store = storageData
// Vue.prototype.$mqtt = mqtt()

let vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// websocket监听文件
// websocketListener(vm)