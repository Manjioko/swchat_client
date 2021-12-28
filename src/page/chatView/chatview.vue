<template>
  <div class="sw-chatview">
    <topbar :showBack="true" :showMore="true" :username="username" />
    <chatcontent :myAvatar="myAvatar" :clientAvatar="clientAvatar" :roomid="roomid" />
    <inputcontent />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import chatcontent from "@/components/chatContent/chatcontent.vue";
import inputcontent from "@/components/inputContent/inputContent.vue";
import topbar from "@/components/topBar/topbar.vue";
import { Route } from "vue-router";

@Component({
  components: {
    chatcontent,
    inputcontent,
    topbar,
  },
})
export default class Chat_view extends Vue {
  // private params:any = this.$route.params
  private username: string = "";
  private myAvatar: string = "";
  private clientAvatar: string = "";
  private roomid:string | null = null;

  @Watch("$route")
  routerhandle(e: Route) {
    // 解决 IOS 滚动僵住的问题
    // if(e.name == "ChatView") {
    //   let ele: HTMLElement | null = document.getElementById("sw_chat_content")
    //   if(ele)
    //     ele.scrollTop = 1
    // }
    this.username = e.params?.username ?? "";
    let myid: string = localStorage.getItem("userid") as string;
    let clientid: string = e.params.clientid;
    if (e.name === "ChatView") {
      let roomid: string = myid > clientid ? myid + clientid : clientid + myid;
      sessionStorage.setItem("roomid", roomid);
      // 头像
      this.myAvatar = `${this.$api.rootUrl}/public/${myid}/avatar/${myid}_avatar.jpg`;
      this.clientAvatar = `${this.$api.rootUrl}/public/${clientid}/avatar/${clientid}_avatar.jpg`;
      this.roomid = roomid

      // this.$socket.emit("createPrivateChatRoom", {
      //   myid: myid,
      //   clientid: clientid,
      //   roomid: roomid,
      // });
    } else {
      // console.log(sessionStorage.getItem("roomid"))
      // this.$socket.emit("deletePrivateChatRoom", {
      //   roomid: sessionStorage.getItem("roomid"),
      // });
    }
  }

  mounted() {
    let params = this.$route.params;
    this.username = params.username;
    let myid: string = localStorage.getItem("userid") as string;
    let clientid: string = params.clientid;
    let roomid: string = myid > clientid ? myid + clientid : clientid + myid;
    // 头像
    this.myAvatar = `${this.$api.rootUrl}/public/${myid}/avatar/${myid}_avatar.jpg`;
    this.clientAvatar = `${this.$api.rootUrl}/public/${clientid}/avatar/${clientid}_avatar.jpg`;

    sessionStorage.setItem("roomid", roomid);
    // this.$socket.emit("createPrivateChatRoom", {
    //   myid: myid,
    //   clientid: clientid,
    //   roomid: roomid,
    // });
  
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