import { io, Socket } from "socket.io-client"

export default function socket(connectAddr: string,userid="123"): Socket {
    const socket = io(connectAddr,{
        autoConnect: true,                //启动自从自动连接
        secure: true,
        transports: ['websocket'],        // ['websocket', 'polling']
        reconnection: true,               //启动重新连接
        reconnectionAttempts: 5,          //最大重试连接次数
        reconnectionDelay: 2000,          //最初尝试新的重新连接等待时间
        reconnectionDelayMax: 10000,      //最大等待重新连接,之前的2倍增长
        timeout: 20000,
        query: {
          userid: userid
        }
      })

      return socket
}

































// import SocketIO from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'


// console.log(swallowUI)
// Vue.use()

// export default function websocket(connetAddr: string) {
//     return new VueSocketIO(
//         {
//           debug: true,
//           connection: SocketIO( connetAddr, {
//             autoConnect: true,                //启动自从自动连接
//             secure: true,
//             transports: ['websocket'],        // ['websocket', 'polling']
//             reconnection: true,               //启动重新连接
//             reconnectionAttempts: 5,          //最大重试连接次数
//             reconnectionDelay: 2000,          //最初尝试新的重新连接等待时间
//             reconnectionDelayMax: 10000,      //最大等待重新连接,之前的2倍增长
//             timeout: 20000
//           })
//         }
//       )
// }

