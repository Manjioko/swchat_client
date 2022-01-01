import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"
import { ChatBoxtype } from 'vue/types/chatBoxType'

const chatTmpData: any = {}
var time: any;

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
    // websocket 连接 server
    socket.on("connect", () => {
        if (time) {
            clearInterval(time)
        }
        // 通知前端断线重连成功
        bus.$emit("websocketListener_reconnecting", false)
        console.log("websocket connect successed.")
    })
    socket.on("connect_err", () => {
        setTimeout(() => {
            console.log("connect_err")
            socket.connect();
        }, 3000);
    })
    socket.on("disconnect", (reason) => {
        console.log("disconnect")
        reconnect(socket, bus)
        if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
            console.log("io server disconnect")
            socket.connect();
        }

        // else the socket will automatically try to reconnect
    });

    // 正常情况下接收到的别人发送来的信息
    socket.on("privateChatWithOther", (chatBox: ChatBoxtype) => {
        console.log("收到websocket服务器发送来的消息:")
        // 缓存到聊天记录列表
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 将消息发送回viewchat组件
        bus.$emit("websocketListener_get_other_client_chat_chatview", chatBox)
    })

    // 重新连线后服务器会发送断线期间别人发送给你的信息
    socket.on("testreconnect", (chatBox: ChatBoxtype) => {
        // 将消息发送回 viewchat 组件
        bus.$emit("websocketListener_get_disconnect_chat_tmp_chatview", chatBox)
        // 缓存到聊天记录列表
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // console.log(data)
    })

}


function reconnect(socket: Socket, bus: Vue) {

    // 通知前端正在断线重连
    bus.$emit("websocketListener_reconnecting", true)

    time = setInterval(() => {
        console.log("reconnecting...")
        try {
            socket.connect()
        } catch {
            console.log("线路不可用...")
        }
    }, 3000)
}