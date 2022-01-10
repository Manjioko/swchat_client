import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"
import { ChatBoxtype } from 'vue/types/chatBoxType'
import network from './network'
import indexdb from './indexDBClass'

const chatTmpData: any = {}

// 给数组挂上代理,监听数组变化
// 数组变化则需要通知userlist组件作出改变
function proxyArray(bus: Vue): Array<ChatBoxtype> {
    return new Proxy([], {
        get: function (target, key) {
            return Reflect.get(target, key);
        },
        set: function (target, key, value) {
            if (value?.roomid) {
                bus.$emit("websocketListener_send_chatbox_to_userlist", value)
            }
            return Reflect.set(target, key, value);
        }
    });
}



export default function websocketListener(vue: Vue, userid: string) {
    // 总线bus
    const bus: Vue = vue.$bus
    // websocket socket
    const socket: Socket = websocketconfig(vue.$api.rootUrl, userid)
    let db = new indexdb()
    handleSocket(socket, bus)
    handleBus(bus, socket)
}

function handleBus(bus: Vue, socket: Socket) {

    //将全部好友加入私聊房间
    bus.$on("contantslist_join_all_friends_to_private_room_websocketListener", (roomidArr: Array<string>) => {
        // 服务器创建私聊关键字是 createPrivateChatRoom
        // socket.emit("createPrivateChatRoom", roomidArr)
        // 序列化聊天记录
        for (const room of roomidArr) {
            if (!chatTmpData[room])
                chatTmpData[room] = proxyArray(bus)
        }
    })

    // chatview 组件发送信息
    bus.$on("chatview_send_chat_data_to_websocketListener", (chatBox: ChatBoxtype) => {
        // 保存到聊天记录中
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 发往websocket server
        let gotoServerChatBox = JSON.parse(JSON.stringify(chatBox));
        gotoServerChatBox.self = false;
        socket.emit("privateChat", gotoServerChatBox)

    })

    // chatview 组件更新聊天记录
    bus.$on("chatview_get_chat_tmp_websocketListener", (data: string) => {
        bus.$emit("websocketListener_send_updated_chat_tmp_chatview", chatTmpData[data])
    })

}

function handleSocket(socket: Socket, bus: Vue) {

    // 检查网络连接状况，负责websocket连接与断开工作
    network(socket, bus)

    // 正常情况下接收到的别人发送来的信息
    socket.on("privateChatWithOther", (chatBox: ChatBoxtype) => {
        console.log("收到websocket服务器发送来的消息:")
        // 缓存到聊天记录列表
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 将消息发送回viewchat组件
        bus.$emit("websocketListener_get_other_client_chat_chatview", chatBox)
    })

    // 获取断线后的信息
    socket.emit("getDisconnectChatMsg",true)
    // 重新连线后服务器会发送断线期间别人发送给你的信息
    socket.on("testreconnect", (chatBox: ChatBoxtype, cb) => {
        // 将消息发送回 viewchat 组件
        bus.$emit("websocketListener_get_disconnect_chat_tmp_chatview", chatBox)
        // 缓存到聊天记录列表
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // console.log(data)
        cb("ok")
    })

}
