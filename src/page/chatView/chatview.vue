<template>
  <div class="sw-chatview" id="sw_chatview">
    <topbar :showBack="true" :showMore="true" :username="clientname" />
    <chatcontent />
    <inputcontent />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import chatcontent from "@/components/chatContent/chatcontent.vue";
import inputcontent from "@/components/inputContent/inputContent.vue";
import topbar from "@/components/topBar/topbar.vue";
import { Route } from "vue-router";
import { ChatBoxtype } from "vue/types/chatBoxType";

@Component({
  components: {
    chatcontent,
    inputcontent,
    topbar,
  },
})
export default class Chat_view extends Vue {
  private clientname: string = "";
  private myname: string = "";
  private roomid: string | null = null;
  private clientid: string | null = null;
  private userid: string | null = this.$store.getLocalUserid();

  @Watch("$route")
  routerhandle(e: Route) {
    // 解决 IOS 滚动僵住的问题
    // if(e.name == "ChatView") {
    //   let ele: HTMLElement | null = document.getElementById("sw_chat_content")
    //   if(ele)
    //     ele.scrollTop = 1
    // }
    if(e.name !== "ChatView") {
      // 退出页面时也需要消除userlist的红点
      this.$bus.$emit("viewchat_leave_page_clear_reddot_userlist",this.clientid)
    }
  }

  mounted() {}
  beforeCreate() {}

  @Watch("roomid")
  updateTheChatlist(newvalue: string, oldvalue: string) {
    if (newvalue !== oldvalue) {
      // roomid更换时更新聊天记录 0
      this.$bus.$emit("chatview_get_chat_tmp_websocketListener", this.roomid);
    }
  }
  created() {
    // 如果之前没有加载页面就初始化
    this.roomid = this.$store.getLocalRoomid();
    this.clientid = this.$store.getLocalClientid();
    this.clientname = this.$store.getLocalClientname();
    this.myname = this.$store.getLocalUsername()
    // 挂个bus,随时更新 id
    this.$bus.$on("contactslist_update_ids_chatview", (idObj: any) => {
      this.roomid = idObj.roomid;
      this.clientid = idObj.clientid;
      this.clientname = idObj.clientname;
    });
    // 这是userlist页面的bus,随时更新id
    this.$bus.$on("userlist_update_ids_chatview", (idObj: any) => {
      this.roomid = idObj.roomid;
      this.clientid = idObj.clientid;
      this.clientname = idObj.clientname;
    });
    // 监听聊天记录更新 1
    this.$bus.$on(
      "websocketListener_send_updated_chat_tmp_chatview",
      (data: Array<string>) => {
        // 更新 chatcontent组件的聊天记录
        if (data)
          this.$bus.$emit("chatview_update_chatArr_to_chatcontent", data);
      }
    );
  }
  beforeMount() {
    // bus监听键盘输入
    this.$bus.$on("inputContent", (data: string) => {
      let avatar: string = `${this.$api.rootUrl}/public/${this.userid}/avatar/${this.userid}_avatar.jpg`;
      let chatBox: ChatBoxtype = {
        self: true,
        time: new Date().getTime(),
        content: data,
        avatar: avatar,
        myid: this.userid ?? "",
        clientid: this.clientid ?? "",
        roomid: this.roomid ?? "",
        clientname: this.clientname,
        myname: this.myname
      };
      // 将消息发往chatcontent组件
      this.$bus.$emit("chatview_send_chat_data_to_chatcontent", chatBox);
      // 将消息发往服务器
      this.$bus.$emit("chatview_send_chat_data_to_websocketListener", chatBox);
    });

    // 接受chatcontent委托将消息再发往服务器
    this.$bus.$on("chatcontent_resend_data_to_serve_chatview",(chatBox:ChatBoxtype) => {
      // 将消息发往服务器
      this.$bus.$emit("chatview_send_chat_data_to_websocketListener", chatBox);
    })

    // bus 监听服务器发送来的聊天信息
    this.$bus.$on(
      "websocketListener_get_other_client_chat_chatview",
      (chatBox: ChatBoxtype) => {
        // 将消息发往chatcontent组件
        if (chatBox && chatBox.roomid === this.roomid)
          this.$bus.$emit("chatview_send_chat_data_to_chatcontent", chatBox);
      }
    );
    // 
    this.$bus.$on("websocketListener_get_disconnect_chat_tmp_chatview",(chatBox: ChatBoxtype) => {
      // 将消息发往chatcontent组件
        if (chatBox && chatBox.roomid === this.roomid)
          this.$bus.$emit("chatview_send_chat_data_to_chatcontent", chatBox);
    })
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-chatview {
    width: 100vw;
    height: 100vh;
    // height: 100%;
    // position: relative;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // background-color: rgb(0, 218, 65);
    overflow: hidden;
    // position: relative;
  }
}
</style>