import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"


export default function websocketListener(vue: Vue) {
    const websocket: any = handleSocket(vue)
}

function handleSocket(vue: Vue) {

    // 总线bus
    const bus: Vue = vue.$bus
    // websocket socket
    const socket:Socket = websocketconfig(vue.$api.rootUrl)

    socket.on("connect",() => {
        console.log("success !!!!!!!")
    })

    bus.$on("inputContent", (data: string) => {

    })
}