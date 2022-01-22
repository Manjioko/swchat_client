import mqtt from 'mqtt'

export default function () {
    let options = {
        clientId: "manjioko",
        clean: false,
        reconnectPeriod: 0,
        username: "jioko",
        password: '1234',
        connectTimeout: 3000,
    }

    const client = mqtt.connect('wss://www.swchat.xyz:6438',options)

    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (!err) {
                client.publish('presence', 'Hello mqtt')
            }
        })
    })

    client.on('message', function (topic:string, message:any) {
        // message is Buffer
        console.log(message.toString())
        // client.end()
    })

    client.on("disconnect",function(){
        console.log("disconnect")
    })

    client.on("offline",function(){
        console.log("offline")
    })

    client.on("reconnect",function(){
        console.log("reconnect")
    })

    client.on("error",function(err:any){
        console.log(err)
    })

    return client
}