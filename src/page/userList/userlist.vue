<template>
  <div>
    <div class="sw-userlist" id="sw_userlist">
      <!-- <div id="xxxxxx"></div> -->
      <div
        class="sw-userlist-outLevel-class"
        v-for="(item, key) in userObject"
        :key="key"
        @click="
          handleGotoChatContent(
            item.clientname,
            item.clientid,
            item.roomid,
            key
          )
        "
      >
        <div class="sw-userlist-avatar-class">
          <div
            class="sw-userlist-reddot-class"
            v-show="item.unreadchatNumber > 0"
          >
            <span>{{ item.unreadchatNumber }}</span>
          </div>
          <s-avatar :sSrc="item.avatar" :sWidth="50" :sHeight="50" />
        </div>

        <div class="sw-userlist-text-class">
          <div>{{ item.clientname }}</div>
          <div class="sw-userlist-chatcontent-class">
            {{ item.lastContent }}
          </div>
        </div>
        <div class="sw-userlist-time-class">
          <span>上午 11:53</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { ChatBoxtype } from "vue/types/chatBoxType";

@Component({
  components: {},
})
export default class Chat_content extends Vue {
  // private userList: Array<any> = [];
  private userObject: any = {};
  private reddot: number = 0;

  @Watch('reddot')
    handleReddot(newreddot:number,oldreddot:number) {
      if(newreddot !== oldreddot) {
        // console.log(`The red dot is ${newreddot}`)
        this.$bus.$emit("userlist_send_reddot_number_to_bottombar",newreddot)
      }
    }

  private handleGotoChatContent(
    clientname: string,
    clientid: string,
    roomid: string,
    key: string
  ) {
    // 设置roomid
    this.$store.setLocalRoomid(roomid);
    // 设置clientid
    this.$store.setLocalClientid(clientid);
    // 设置clientName
    this.$store.setLocalClientname(clientname);
    //更新chatview页面内的roomid 和 clientid
    this.$bus.$emit("userlist_update_ids_chatview", {
      roomid: roomid,
      clientid: clientid,
      clientname: clientname,
    });
    // 计算红点总数
    this.reddot -= this.userObject[key].unreadchatNumber;
    // 红点清零
    this.userObject[key].unreadchatNumber = 0;

    this.$router.push({
      name: "ChatView",
      params: {
        username: this.$store.getLocalUsername() ?? "",
        clientid: this.$store.getLocalClientid() ?? "",
      },
    });
  }

  private notification(chatBox: ChatBoxtype) {
    if (window.Notification) {
      if (window.Notification.permission === "granted") {
        if (!chatBox.self)
          new Notification(chatBox.clientname as string, {
            body: chatBox.content,
            icon: chatBox.avatar,
          });
      } else if (window.Notification.permission === "denied") {
        console.log("用户拒绝通知");
      } else {
        window.Notification.requestPermission();
      }
    } else {
      console.log("你的浏览器不支持此特性，请下载谷歌浏览器试用该功能");
    }
  }

  created() {
    // 消息发送或接收都会经过这里
    this.$bus.$on(
      "websocketListener_send_chatbox_to_userlist",
      (chatBox: ChatBoxtype) => {
        this.buildUserObject(chatBox);
        this.notification(chatBox);
      }
    );
    // 从contactslist组件进入时也需要消除红点
    this.$bus.$on("contactslist_clear_reddot_userlist", (clientid: string) => {
      if (this.userObject[clientid]) {
        // 计算红点总数
        this.reddot -= this.userObject[clientid].unreadchatNumber;
        // 红点清零
        this.userObject[clientid].unreadchatNumber = 0;
      }
    });
    // 从viewchat 页面退出也也需要消除红点
    this.$bus.$on(
      "viewchat_leave_page_clear_reddot_userlist",
      (clientid: string) => {
        if (this.userObject[clientid]) {
          // 计算红点总数
          this.reddot -= this.userObject[clientid].unreadchatNumber;
          // 红点清零
          this.userObject[clientid].unreadchatNumber = 0;
        }
      }
    );
  }

  private buildUserObject(chatBox: ChatBoxtype) {
    if (chatBox.self) {
      let clientid: string = chatBox.clientid as string;
      if (this.userObject[clientid]) {
        this.userObject[clientid].lastContent = chatBox.content;
      } else {
        let obj = {
          clientname: chatBox.clientname,
          clientid: chatBox.clientid,
          avatar: `${this.$api.rootUrl}/public/${chatBox.clientid}/avatar/${chatBox.clientid}_avatar.jpg`,
          lastContent: chatBox.content,
          unreadchatNumber: 0,
          roomid: chatBox.roomid,
        };
        this.$set(this.userObject, clientid, obj);
      }
    } else {
      let clientid: string = chatBox.myid as string;
      if (this.userObject[clientid]) {
        this.userObject[clientid].lastContent = chatBox.content;
        this.userObject[clientid].unreadchatNumber += 1;
        // 计算总红点数
        this.reddot += 1;
      } else {
        let obj = {
          clientname: chatBox.myname,
          clientid: chatBox.myid,
          avatar: chatBox.avatar,
          lastContent: chatBox.content,
          unreadchatNumber: 1,
          roomid: chatBox.roomid,
        };
        this.$set(this.userObject, clientid, obj);
        // 计算总红点数
        this.reddot += 1;
      }
    }
  }

  mounted() {
    let ele: HTMLElement | null = document.getElementById("sw_userlist");
    if (ele) ele.scrollTop = parseInt(sessionStorage.getItem("st") ?? "1");
  }

  @Watch("$route")
  routerhandle(e: Route) {
    if (e.name == "Home") {
      let ele: HTMLElement | null = document.getElementById("sw_userlist");
      if (ele) ele.scrollTop = parseInt(sessionStorage.getItem("st") ?? "0");
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-userlist {
    width: 100vw;
    height: 78vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-userlist-outLevel-class {
    // width: 95vw;
    height: 6vh;
    min-height: 50px;
    background-color: rgb(253, 253, 253);
    text-align: start;
    padding: 1.2vh;
    border-bottom: 1px solid #e0dfdf;
    // border-top: 1px solid #e0dfdf;
  }
  .sw-userlist-avatar-class {
    float: left;
    position: relative;
  }
  .sw-userlist-text-class {
    font-size: 5.5vw;
    width: 60vw;
    // height: 7vh;
    margin-left: 3vw;
    // background-color: white;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    div:nth-child(1) {
      display: contents;
    }
  }
  .sw-userlist-chatcontent-class {
    font-size: 3.3vw;
    color: #a7a6a6;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sw-userlist-time-class {
    width: 15vw;
    // height: 3vh;
    float: right;
    // margin-top: 0.3vh;
    /* background-color: red; */
    // display: inline-block;
    font-size: 3vw;
    color: #e5e5e5;
  }
  .sw-userlist-reddot-class {
    background: red;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    font-size: 14px;
    color: white;
    position: absolute;
    right: -8px;
    top: -6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>