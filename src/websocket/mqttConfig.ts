import mqtt from 'mqtt'
import Vue from 'vue'

function mqttClient (url:string,userid:string,bus:Vue,username?:string,password?:string) {
    let options = {
        clientId: userid,
        clean: false,
        reconnectPeriod: 4000,
        username: username ?? '',
        password: password ?? '',
        connectTimeout: 3*1000,
        resubscribe: false
    }


    const client = mqtt.connect(url,options)

    client.on('connect', function () {
        // client.subscribe('presence', function (err) {
        //     if (!err) {
        //         client.publish('presence', 'Hello mqtt')
        //     }
        // })
        // 1 代表网络连接成功
        bus.$emit("websocketListener_reconnecting", 1)
        console.log("mqtt 连接正常")
    })

    // client.on('message', function (topic:string, message:any) {
    //     // message is Buffer
    //     console.log(message.toString())
    //     // client.end()
    // })

    client.on("disconnect",function(){
        console.log("mqtt 服务器断开连接")
        // 2 代表网络断线
        bus.$emit("websocketListener_reconnecting", 2)
    })

    // client.on("offline",function(){
    //     console.log("offline")
    // })

    client.on("reconnect",function(){
        console.log("reconnect")
        // 0 代表正在连接...
        bus.$emit("websocketListener_reconnecting", 0)
    })

    client.on("error",function(err:any){
        console.log(err)
    })

    // 网络连接触发
    window.addEventListener("online", (event: any) => {
        console.log("网络连接正常")
        try {
            client.reconnect()
        } catch {
            console.log("无法连接mqtt")
        }
    })
    // 网络断开触发
    window.addEventListener("offline", (event: any) => {
        // 2 代表 网络断线
        console.log("网络断线")
        bus.$emit("websocketListener_reconnecting", 2)
        client.end()
    })

    return client
}

export default mqttClient