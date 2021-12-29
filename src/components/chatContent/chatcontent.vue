<template>
  <div class="sw-chatcontent" id="sw_chat_content">
    <div
      v-for="(item, index) in chatArr"
      :key="index + 'chartbox'"
      :class="{ chatboxClass: item.self, chatboxClass_other: !item.self }"
    >
      <div
        :class="{
          's-chatbox-extend-con-class': item.self,
          's-chatbox-extend-con-other-class': !item.self,
        }"
      >
        <s-chatbox :sContent="item.content" :sSelf="item.self" />
      </div>
      <div
        :class="{
          's-chatbox-extend-img-class': item.self,
          's-chatbox-extend-img-other-class': !item.self,
        }"
      >
        <s-avatar :sSrc="item.avatar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { ChatBoxtype } from "vue/types/chatBoxType";

@Component({})
export default class Chat_content extends Vue {
  private chatArr: Array<ChatBoxtype> = [];
  // private userChat: any = {};
  // @Prop(String) readonly roomid: string | undefined;

  // @Watch("roomid")
  // differentUserHandle(newid:string,oldid:string) {
  //   if(newid !== oldid) {
  //     this.chatArr = this.userChat[newid] ?? []
  //   }
  // }

  mounted() {
    this.$bus.$on("chatview_update_chatArr_to_chatcontent",(newChatArr:Array<ChatBoxtype>) => {
      this.chatArr = [...newChatArr]
    })
    this.$bus.$on("chatview_send_chat_data_to_chatcontent",(data:ChatBoxtype) => {
      this.chatArr.push(data)
    })
    // let roomid:string = sessionStorage.getItem("roomid") ?? ''
    // let oldChatArr = this.userChat[roomid]
    // if(oldChatArr) {
    //   this.chatArr = oldChatArr
    // }
    // // 读取键盘输入
    // this.$bus.$on("inputContent", (data: string) => {
    //   let text: ChatBoxtype = {
    //     time: new Date().getTime(),
    //     content: data,
    //     self: true,
    //   };
    //   this.chatArr.push(text);
    //   let id: string = this.roomid ?? sessionStorage.getItem("roomid") ?? ''
    //   if(this.userChat[id]) {
    //     this.userChat[id].push(text)
    //   } else {
    //     this.userChat[id] = []
    //     this.userChat[id].push(text)
    //   }
      // this.$socket.emit("otherSendMsg",text)
      // this.$socket.emit("privateChat",{
      //   roomid: id,
      //   chat: text
      // })
    // });
    // 处理私聊信息
    // this.sockets.subscribe("privateChatWithOther", (e: any) => {
    //   console.log(e);
    //   let serverRoomid = e.roomid
    //   let chat = e.chat
    //   chat.self = false
    //   let myid: string = sessionStorage.getItem('roomid') ?? ''
    //   console.log("serverRoomid is " + serverRoomid)
    //   console.log("myid is "+ myid)
    //   if(myid === serverRoomid) {
    //     this.chatArr.push(chat)
    //   }
    //   if(this.userChat[roomid]) {
    //     this.userChat[roomid].push(chat)
    //   } else {
    //     this.userChat[roomid] = []
    //     this.userChat[roomid].push(chat)
    //   }
    //   // console.log(this.userChat)
    // });
  }

  updated() {
    let ele = document.getElementById("sw_chat_content");
    if (ele) {
      ele.scrollTop = ele?.scrollHeight;
    }
  }
  // 监听路由变化
  @Watch("$route")
  routerhandle(e: Route) {
    // 解决 IOS 滚动僵住的问题
    if(e.name == "ChatView") {
      let ele: HTMLElement | null = document.getElementById("sw_chat_content")
      if(ele)
        ele.scrollTop = 1
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-chatcontent {
    width: 100vw;
    height: 78.6vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-chatcontent-test {
    width: 100vw;
    height: 106vh;
  }
  .chatboxClass {
    text-align: end;
    margin: 1.3vh;
    // margin-bottom: 20px;
  }
  .chatboxClass_other {
    text-align: start;
    margin: 1.3vh;
    // margin-bottom: 20px;
  }
  .s-chatbox-extend-con-class {
    display: inline-block;
    margin-right: 4.3vw;
  }
  .s-chatbox-extend-img-class {
    float: right;
    user-select: none;
    image {
      -webkit-user-drag: none;
    }
  }

  .s-chatbox-extend-con-other-class {
    display: inline-block;
    margin-left: 1.4vw;
  }
  .s-chatbox-extend-img-other-class {
    float: left;
    user-select: none;
    image {
      -webkit-user-drag: none;
    }
  }
}
</style>