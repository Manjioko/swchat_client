<template>
  <div>
    <s-alter
      :sMsg="showDeleteMsg"
      v-if="showDeleteMsg"
      @sYes="deleteYesHandle"
      @sNo="deleteNoHandle"
    />
    <div
      class="sw-userlist"
      id="sw_userlist"
      @touchstart="touchstartHandle($event)"
      @touchmove="touchmoveHandle($event)"
    >
      <!-- <div id="xxxxxx"></div> -->
      <div
        class="sw-userlist-for-list-class"
        v-for="(item, key) in userObject"
        :key="key"
      >
        <!-- outlayout -->
        <div
          class="sw-userlist-outLevel-class"
          @touchend="
            touchendHandle(item.clientname, item.clientid, item.roomid, key)
          "
        >
          <div class="sw-userlist-avatar-class">
            <div
              class="sw-userlist-reddot-class"
              v-show="item.unreadchatNumber > 0"
            >
              <span>{{ item.unreadchatNumber }}</span>
            </div>
            <div class="sw-userlist-avatar-img-class">
              <s-avatar :sSrc="item.avatar" :sWidth="50" :sHeight="50" />
            </div>
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
        <!-- delete -->
        <div
          class="sw-userlist-delete-outlayout-class"
          @click="deleteHandle(item.clientname, item.clientid)"
        >
          <div class="sw-userlist-delete-text-class">删除</div>
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

  //提示用户删除操作
  // private isShowDeleteMsg: boolean = false;
  private showDeleteMsg: string = "";
  private deletclientId: string = "";

  private touchStartX: number = 0;
  private touchMoveX: number = 0;
  private moveWidth: number = 0;
  private divTarget: HTMLElement | null = null;
  private tmpDivTarget: HTMLElement | null = null;

  private canRoute: boolean = true

  @Watch("reddot")
  handleReddot(newreddot: number, oldreddot: number) {
    if (newreddot !== oldreddot) {
      // console.log(`The red dot is ${newreddot}`)
      this.$bus.$emit("userlist_send_reddot_number_to_bottombar", newreddot);
    }
  }

  private deleteHandle(name: string, id: string) {
    this.showDeleteMsg = `确定删除 ${name} 吗?`;
    this.deletclientId = id;
  }
  private deleteYesHandle() {
    this.showDeleteMsg = "";
    delete this.userObject[this.deletclientId];
    this.deletclientId = "";
  }
  private deleteNoHandle() {
    this.showDeleteMsg = "";
  }

  private touchstartHandle(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.divTarget = event.target as HTMLElement;

    while (
      this.divTarget &&
      ![...this.divTarget.classList].includes("sw-userlist-outLevel-class")
    ) {
      this.divTarget = this.divTarget?.parentElement as HTMLElement;
    }

    let w: string = this.divTarget?.style.left ?? "0";
    if (parseInt(w) !== 0) {
      this.canRoute = false
      if (this.divTarget?.style) {
        this.divTarget.style.transitionDuration = "0.5s";
        this.divTarget.style.transitionTimingFunction = "ease";
        this.divTarget.style.left = "0px";
      }
    }

    // 每次只能有一个单位能被左划
    let tmpW: string = this.tmpDivTarget?.style.left ?? '0'
    if (parseInt(tmpW) !== 0) {
      this.canRoute = false;
      if (this.tmpDivTarget?.style) {
        this.tmpDivTarget.style.transitionDuration = "0.5s";
        this.tmpDivTarget.style.transitionTimingFunction = "ease";
        this.tmpDivTarget.style.left = "0px";
      }
    }

  }

  private touchmoveHandle(event: TouchEvent) {
    if (this.divTarget?.style.transition) this.divTarget.style.transition = "";
    this.canRoute = false;
    this.touchMoveX = event.touches[0].clientX;
    this.moveWidth = this.touchStartX - this.touchMoveX;

    if (this.moveWidth > 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(
          this.divTarget.style.left ? this.divTarget.style.left : "0"
        );
        if (w > -60) this.divTarget.style.left = w - 3 + "px";
      }
    }
    if (this.moveWidth < 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(this.divTarget.style.left);
        if (w < 0) this.divTarget.style.left = w + 3 + "px";
      }
    }
  }
  private touchendHandle(
    clientname: string,
    clientid: string,
    roomid: string,
    key: string
  ) {
    // console.log(e)
    if (this.divTarget?.style) {
      let w: number = parseInt(this.divTarget.style.left);
      this.divTarget.style.transitionDuration = "0.2s";
      this.divTarget.style.transitionTimingFunction = "ease";
      // console.log(w);
      // 分两种情况
      // 向左划
      if (this.moveWidth > 0) {
        if (w < -10) {
          this.divTarget.style.left = "-60px";
        } else {
          this.divTarget.style.left = "0px";
        }
      } else {
        // 向右划
        if (w > -50) {
          this.divTarget.style.left = "0px";
        } else {
          this.divTarget.style.left = "-60px";
        }
      }
    }

    // console.log("this.movewidth:" + this.moveWidth)
    // 导航到chatview
    let w: string = this.divTarget?.style.left ?? '0px'

    // 缓存left不为零的元素
    if(parseInt(w)) {
      this.tmpDivTarget = this.divTarget
    }
    
    if (this.canRoute) {
      this.handleGotoChatContent(clientname, clientid, roomid, key);
      // this.handleGotoChatContent()
    }
    this.canRoute = true
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
      console.log("浏览器不支持notification");
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
  .sw-userlist-for-list-class {
    border-bottom: 1px solid #e0dfdf;
    position: relative;
    width: 100vw;
    height: 75px;
  }
  .sw-userlist-outLevel-class {
    // // width: 95vw;
    // height: 6vh;
    // min-height: 50px;
    // background-color: rgb(253, 253, 253);
    // text-align: start;
    // padding: 1.2vh;
    // border-bottom: 1px solid #e0dfdf;
    // // border-top: 1px solid #e0dfdf;

    height: 100%;
    width: 100%;
    min-height: 75px;
    background-color: #fdfdfd;
    text-align: start;
    // border-bottom: 1px solid #e0dfdf;
    z-index: 1;
    position: relative;
    left: 0;
    // transition-duration: 0.3s;
    // transition-property: all;
    // transition-timing-function: ease;
  }
  .sw-userlist-avatar-class {
    float: left;
    position: relative;
  }
  .sw-userlist-avatar-img-class {
    padding: 12px;
    float: left;
  }
  .sw-userlist-text-class {
    font-size: 5.5vw;
    width: 60vw;
    // height: 7vh;
    margin-top: 2.3vh;
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
    right: 5px;
    top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sw-userlist-delete-outlayout-class {
    width: 60px;
    height: 75px;
    background: red;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    text-align: center;
    top: 0;
    right: 0;
  }
  .sw-userlist-delete-text-class {
    position: relative;
    top: 30%;
    color: white;
    user-select: none;
  }

}
</style>