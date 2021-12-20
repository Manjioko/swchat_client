import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import swallowUI from 'swallow-ui'

import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

Vue.use(swallowUI)
// console.log(swallowUI)
Vue.use(new VueSocketIO(
  {
    debug: true,
    connection: SocketIO('http://192.168.100.28:3000', {
      autoConnect: true,                //启动自从自动连接
      secure: true,
      transports: ['websocket'],        // ['websocket', 'polling']
      reconnection: true,               //启动重新连接
      reconnectionAttempts: 5,          //最大重试连接次数
      reconnectionDelay: 2000,          //最初尝试新的重新连接等待时间
      reconnectionDelayMax: 10000,      //最大等待重新连接,之前的2倍增长
      timeout: 20000
    })
  }
))

Vue.config.productionTip = false


Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
