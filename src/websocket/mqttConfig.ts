import mqtt from 'mqtt'
import Vue from 'vue'

// 闭包,主要用于解决相同id重复占线的问题
function closer() {
    let maxconnect = 3
    let time: any;
    return function (add: number) {
        if (!time) {
            time = setTimeout(() => {
                maxconnect = 3
            }, 30000);
        }
        if (add === 1) {
            return maxconnect -= 1
        } else {
            return maxconnect
        }
    }
}

let maxconnect = closer()

function mqttClient(url: string, userid: string, bus: Vue, username?: string, password?: string) {
    let options = {
        clientId: userid,
        clean: false,
        keepalive: 2,
        reconnectPeriod: 4000,
        connectTimeout: 4 * 1000,
        username: username ?? '',
        password: password ?? '',
        resubscribe: false
    }


    const client = mqtt.connect(url, options)

    client.on('connect', function () {
        // 1 代表网络连接成功
        if (client.connected) {
            bus.$emit("websocketListener_reconnecting", 1)
            console.log("mqtt 连接正常")
        } else {
            bus.$emit("websocketListener_reconnecting", 2)
        }
    })

    client.on("disconnect", function () {
        console.log("mqtt 服务器断开连接")
        client.end()
        // 2 代表网络断线
        bus.$emit("websocketListener_reconnecting", 2)
    })

    client.on("offline", function () {
        console.log("offline")
        if (!maxconnect(2)) {
            client.end()
            bus.$emit("websocketListener_reconnecting", 2)
        } else {
            maxconnect(1)
        }
    })

    // client.on("packetsend",function(packet) {
    //     console.log("send packet : ")
    //     console.log(packet)
    // })

    // client.on("packetreceive",function(packet) {
    //     console.log("receive packet : ")

    //     console.log(packet)
    // })


    client.on("reconnect", function () {
        console.log("reconnect")
        // 0 代表正在连接...
        bus.$emit("websocketListener_reconnecting", 0)
    })

    client.on("error", function (err: any) {
        console.log(err)
    })

    // 网络连接触发
    window.addEventListener("online", (event: any) => {
        console.log("网络连接正常")
        // alert("online")
        try {
            client.end()
            if (!client.connected) {
                client.reconnect()
            }
        } catch {
            console.log("无法连接mqtt")
            client.end()
        }
    })
    // 网络断开触发
    window.addEventListener("offline", (event: any) => {
        // alert("offline")
        // 2 代表 网络断线
        console.log("网络断线")
        bus.$emit("websocketListener_reconnecting", 2)
        client.end()
    })

    window.addEventListener("beforeunload", () => {
        client.end()
    })

    return client
}

export default mqttClient