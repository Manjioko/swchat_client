import websocketconfig from './websocketConfig'
import { Socket } from 'socket.io-client'
import Vue from "vue"
import { ChatBoxtype } from 'vue/types/chatBoxType'
import network from './network'
import { MqttClient } from 'mqtt'
import mqttConfig from './mqttConfig'

const chatTmpData: any = {}

// 给数组挂上代理,监听数组变化
// 数组变化则需要通知userlist组件作出改变
function proxyArray(vue: Vue): Array<ChatBoxtype> {
    let myid: string = vue.$store.getLocalUserid()
    return new Proxy([], {
        get: function (target, key) {
            return Reflect.get(target, key);
        },
        set: function (target, key, value) {
            if (value?.roomid) {
                // userlist 界面显示需要数据
                vue.$bus.$emit("websocketListener_send_chatbox_to_userlist", value)
                // 重发消息不记录到数据库
                if (!value.unsucess) {
                    // 正常无断线聊天
                    vue.$db.updateDataToDB(myid, value.roomid, value)
                } else if (!value.self && value.unsucess) {
                    // 聊天对象的断线重发
                    delete value.unsucess
                    vue.$db.updateDataToDB(myid, value.roomid, value)
                }
            }
            // return Reflect.set(target, key, value);
            return true
        }
    });
}



export default function websocketListener(vue: Vue, userid: string) {
    // 总线bus
    const bus: Vue = vue.$bus
    // websocket socket
    // const socket: Socket = websocketconfig(vue.$api.rootUrl, userid)
    // network(socket, bus)
    // mqtt connect
    const mqtt: MqttClient = mqttConfig(vue.$api.mqtturl, userid, bus)
    handleMqtt(mqtt, bus, userid)
    handleMqttBus(mqtt,vue)
    // alert("vibrate" in navigator)
    // console.log("vibrate" in navigator)
    // handleSocket(socket, bus)
    // handleBus(vue, socket)
}

function handleMqtt(mqtt: MqttClient, bus: Vue, userid: string) {

    // mqtt 订阅
    mqtt.subscribe(userid,{ qos: 1 }, (err) => {
        if (!err) {
            console.log("mqtt 订阅成功")
        } else {
            console.log(err)
        }
    })

    // 正常情况下接收到的别人发送来的信息
    mqtt.on("message", (topic: any,payload,packt) => {
        console.log("收到mqtt服务器发送来的消息:")
        let chatBox: ChatBoxtype = JSON.parse(payload.toString())
        chatBox.self = false
        // 缓存到聊天记录列表
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 将消息发送回viewchat组件
        bus.$emit("websocketListener_get_other_client_chat_chatview", chatBox)
        // console.log(data)
        // console.log(abc.toString())
        console.log(`topic is: ${topic} qos is: ${packt.qos},payload is ${payload}`)
    })

}

function handleMqttBus(mqtt:MqttClient,vue:Vue) {

    let myid: string = vue.$store.getLocalUserid()
    //将全部好友加入私聊房间
    vue.$bus.$on("contantslist_join_all_friends_to_private_room_websocketListener", (roomidArr: Array<string>) => {
        // 服务器创建私聊关键字是 createPrivateChatRoom
        // socket.emit("createPrivateChatRoom", roomidArr)
        // 序列化聊天记录
        for (const room of roomidArr) {
            if (!chatTmpData[room]) {
                chatTmpData[room] = proxyArray(vue)
                vue.$db.addDataToDB(myid, room)
            }
        }
    })

    // chatview 组件发送信息
    vue.$bus.$on("chatview_send_chat_data_to_websocketListener", (chatBox: ChatBoxtype) => {
        // 保存到聊天记录中
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 发往websocket server
        let gotoServerChatBox = JSON.parse(JSON.stringify(chatBox));
        gotoServerChatBox.self = false;
        // socket.emit("privateChat", gotoServerChatBox, (result: any) => {
        //     if (result) {
        //         console.log(result)
        //         // 发往服务器消息成功回执，送回chatcontent
        //         vue.$bus.$emit("websocketListener_verify_success_data_from_server_chatcontent", gotoServerChatBox)
        //     }
        // })
        mqtt.publish(chatBox.clientid ?? 'nothing', JSON.stringify(chatBox),{ qos:1 },function(err) {
            if (err) {
                console.log(err)
              } else {
                console.log('Published')
                // 发往服务器消息成功回执，送回chatcontent
                vue.$bus.$emit("websocketListener_verify_success_data_from_server_chatcontent", gotoServerChatBox)
              }
        })

        // mqtt.publish(gotoServerChatBox.clientid,gotoServerChatBox)

    })

    // chatview 组件更新聊天记录
    vue.$bus.$on("chatview_get_chat_tmp_websocketListener", async (roomid: string) => {
        // let chatBoxArr = chatTmpData[roomid] as Array<ChatBoxtype>
        // 从数据库读取聊天信息
        let chatBoxArr: Array<ChatBoxtype> = await vue.$db.getDataFromDB(myid, roomid)
        if (chatBoxArr) {
            vue.$bus.$emit("websocketListener_send_updated_chat_tmp_chatview", chatBoxArr)
        }
    })

}

function handleBus(vue: Vue, socket: Socket) {

    let myid: string = vue.$store.getLocalUserid()
    //将全部好友加入私聊房间
    vue.$bus.$on("contantslist_join_all_friends_to_private_room_websocketListener", (roomidArr: Array<string>) => {
        // 服务器创建私聊关键字是 createPrivateChatRoom
        // socket.emit("createPrivateChatRoom", roomidArr)
        // 序列化聊天记录
        for (const room of roomidArr) {
            if (!chatTmpData[room]) {
                chatTmpData[room] = proxyArray(vue)
                vue.$db.addDataToDB(myid, room)
            }
        }
    })

    // chatview 组件发送信息
    vue.$bus.$on("chatview_send_chat_data_to_websocketListener", (chatBox: ChatBoxtype) => {
        // 保存到聊天记录中
        chatTmpData[chatBox.roomid as string].push(chatBox)
        // 发往websocket server
        let gotoServerChatBox = JSON.parse(JSON.stringify(chatBox));
        gotoServerChatBox.self = false;
        socket.emit("privateChat", gotoServerChatBox, (result: any) => {
            if (result) {
                console.log(result)
                // 发往服务器消息成功回执，送回chatcontent
                vue.$bus.$emit("websocketListener_verify_success_data_from_server_chatcontent", gotoServerChatBox)
            }
        })

    })

    // chatview 组件更新聊天记录
    vue.$bus.$on("chatview_get_chat_tmp_websocketListener", async (roomid: string) => {
        // let chatBoxArr = chatTmpData[roomid] as Array<ChatBoxtype>
        // 从数据库读取聊天信息
        let chatBoxArr: Array<ChatBoxtype> = await vue.$db.getDataFromDB(myid, roomid)
        if (chatBoxArr) {
            vue.$bus.$emit("websocketListener_send_updated_chat_tmp_chatview", chatBoxArr)
        }
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
    socket.emit("getDisconnectChatMsg", true)
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
