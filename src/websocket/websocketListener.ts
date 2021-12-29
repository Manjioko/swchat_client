import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"


export default function websocketListener(vue: Vue) {
    // 总线bus
    const bus: Vue = vue.$bus
    // websocket socket
    const socket: Socket = websocketconfig(vue.$api.rootUrl)
    handleSocket(socket, bus)
    handleBus(bus, socket)
}

function handleBus(bus: Vue, socket: Socket) {
    //将全部好友加入私聊房间
    bus.$on("contantslist_join_all_friends_to_private_room_websocketListener", (roomidArr: Array<string>) => {
        // 服务器创建私聊关键字是 createPrivateChatRoom
        socket.emit("createPrivateChatRoom", roomidArr)
    })
}

function handleSocket(socket: Socket, bus: Vue) {


    socket.on("connect", () => {
        console.log("success !!!!!!!")
    })
}