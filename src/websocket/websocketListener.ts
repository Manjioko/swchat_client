import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"
import { ChatBoxtype } from 'vue/types/chatBoxType'

const chatTmpData: any = {}


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
        // 序列化聊天记录
        for (const room of roomidArr) {
            chatTmpData[room] = []
        }
    })
    // chatview 组件发送信息
    bus.$on("chatview_send_chat_data_to_websocketListener",(chatBox: ChatBoxtype) => {
        // 保存到聊天记录中
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 发往websocket server
        let gotoServerChatBox = JSON.parse(JSON.stringify(chatBox));
        gotoServerChatBox.self = false;
        socket.emit("privateChat",gotoServerChatBox)
        
    })
    // chatview 组件更新聊天记录
    bus.$on("chatview_get_chat_tmp_websocketListener",(data: string) => {
        bus.$emit("websocketListener_send_updated_chat_tmp_chatview",chatTmpData[data])
    })
}

function handleSocket(socket: Socket, bus: Vue) {
    // websocket 连接 server
    socket.on("connect", () => {
        console.log("websocket connect successed.")
    })

    socket.on("privateChatWithOther",(chatBox:ChatBoxtype) => {
        console.log("收到websocket服务器发送来的消息:")
        chatTmpData[chatBox.roomid as string].push(chatBox)
        bus.$emit("websocketListener_get_other_client_chat_chatview",chatBox)
    })
}