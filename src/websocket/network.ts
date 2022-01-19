import { Socket } from "socket.io-client";
import Vue from "vue";

var time: any;

function network(socket: Socket, bus: Vue) {
    if (navigator.onLine) {
        console.log("网络正常")
        if (!socket.connected) {
            reconnect(socket, bus, "1")
        }
    } else {
        console.log("网络未连接")
    }

    window.addEventListener("online", (event: any) => {
        if (!socket.connected)
            reconnect(socket, bus, "2")
    })
    window.addEventListener("offline", (event: any) => {
        // 2 代表 网络断线
        console.log("网络断线")
        bus.$emit("websocketListener_reconnecting", 2)
        if (time)
            clearInterval(time)
    })

    // websocket 连接 server
    socket.on("connect", () => {
        if (time) {
            clearInterval(time)
        }
        // 通知前端断线重连成功
        // 1 代表 重新连接成功
        bus.$emit("websocketListener_reconnecting", 1)
        console.log("websocket connect successed.")
    })
    socket.on("disconnect", (reason) => {
        console.log("disconnect")
        if (navigator.onLine){
            reconnect(socket, bus, "3")
        }

    });
}


function reconnect(socket: Socket, bus: Vue, str: string) {
    let maxreconnectTry = 5;
    time = setInterval(() => {
        console.log("The time is " + time)
        try {
            if (!socket.connected) {
                console.log("socket.connected "+socket.connected)
                if(maxreconnectTry) {
                    socket.connect()
                    console.log(`reconnecting ${str} ...`)
                    // 通知前端正在断线重连
                    // 0 代表 正在连接...
                    bus.$emit("websocketListener_reconnecting", 0)
                    maxreconnectTry -= 1;
                } else {
                    clearInterval(time)
                    bus.$emit("websocketListener_reconnecting", 2)
                }
            } else {
                clearInterval(time)
            }
        } catch {
            console.log("线路不可用...")
            clearInterval(time)
        }
    }, 4000)
}




export default network