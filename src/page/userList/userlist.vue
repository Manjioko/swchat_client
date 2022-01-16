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
  // 渲染list的数据
  private userObject: any = {};
  // 未读消息红点
  private reddot: number = 0;
  //提示用户删除操作
  private showDeleteMsg: string = "";
  // 用于从userObject删除client数据的缓存clientid
  private deletclientId: string = "";

  // 触碰时的X轴坐标
  private touchStartX: number = 0;
  // 手指移动时X轴坐标
  private touchMoveX: number = 0;
  // 手指移动距touchStartX 的距离
  private moveWidth: number = 0;
  // 需要移动的元素
  private divTarget: HTMLElement | null = null;
  // 上一个移动过的元素,主要用于锁定判断是否只有一个正在移动的元素
  // 如果存在多个,就先还原之前移动的元素
  private tmpDivTarget: HTMLElement | null = null;

  // 路由锁
  private canRoute: boolean = true;

  // 监听红点变化
  @Watch("reddot")
  handleReddot(newreddot: number, oldreddot: number) {
    if (newreddot !== oldreddot) {
      // 通知bottombar红点变化,让bottombar更新红点
      this.$bus.$emit("userlist_send_reddot_number_to_bottombar", newreddot);
    }
  }

  // 删除list数据操作函数
  private deleteHandle(name: string, id: string) {
    this.showDeleteMsg = `确定删除 ${name} 吗?`;
    this.deletclientId = id;
  }
  // 确认删除list数据
  private deleteYesHandle() {
    this.showDeleteMsg = "";
    delete this.userObject[this.deletclientId];
    this.deletclientId = "";
  }
  // 取消删除list数据
  private deleteNoHandle() {
    this.showDeleteMsg = "";
  }

  // 手指触碰到list时触发这个函数
  private touchstartHandle(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.divTarget = event.target as HTMLElement;

    // 定位元素到 sw-contactslist-outLevel-class 
    while (
      this.divTarget &&
      ![...this.divTarget.classList].includes("sw-userlist-outLevel-class")
    ) {
      this.divTarget = this.divTarget?.parentElement as HTMLElement;
    }
    // 获取this.divTarget.style.left 值
    let w: string = this.divTarget?.style.left ? this.divTarget?.style.left: "0";
    if (parseInt(w) !== 0) {
      // 锁死路由
      this.canRoute = false;
      // 设置过渡效果
      if (this.divTarget?.style) {
        this.divTarget.style.transitionDuration = "0.5s";
        this.divTarget.style.transitionTimingFunction = "ease";
        this.divTarget.style.left = "0px";
      }
    }

    // 每次只能有一个单位能被左划
    let tmpW: string = this.tmpDivTarget?.style.left ?? "0";
    if (parseInt(tmpW) !== 0) {
      // 锁死路由
      this.canRoute = false;

      // 解决点击删除备注时页面出现向右划动现象
      let eleClassList = [...(event.target as HTMLElement).classList];
      let isRightDeleteEle =
        eleClassList.includes("sw-userlist-delete-outlayout-class") ||
        eleClassList.includes("sw-userlist-delete-text-class");

      // 设置过渡效果
      if (this.tmpDivTarget?.style && !isRightDeleteEle) {
        this.tmpDivTarget.style.transitionDuration = "0.5s";
        this.tmpDivTarget.style.transitionTimingFunction = "ease";
        this.tmpDivTarget.style.left = "0px";
      }
    }
  }

  // 手指移动
  private touchmoveHandle(event: TouchEvent) {
    if (this.divTarget?.style.transition) this.divTarget.style.transition = "";
    this.canRoute = false;
    this.touchMoveX = event.touches[0].clientX;
    this.moveWidth = this.touchStartX - this.touchMoveX;

    // 移动元素
    if (this.moveWidth > 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(
          this.divTarget.style.left ? this.divTarget.style.left : "0"
        );
        if (w > -60) this.divTarget.style.left = w - 3 + "px";
      }
    }
    // 移动元素
    if (this.moveWidth < 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(this.divTarget.style.left);
        if (w < 0) this.divTarget.style.left = w + 3 + "px";
      }
    }
  }

  // 手指松开
  private touchendHandle(
    clientname: string,
    clientid: string,
    roomid: string,
    key: string
  ) {
    if (this.divTarget?.style) {
      let w: number = parseInt(this.divTarget.style.left);
      this.divTarget.style.transitionDuration = "0.2s";
      this.divTarget.style.transitionTimingFunction = "ease";
      // 向左划
      if (this.moveWidth > 0) {
        if (w < -10) {
          this.divTarget.style.left = "-60px";
        } else {
          this.divTarget.style.left = "0px";
        }
      }
    }

    // 导航到chatview
    let w: string = this.divTarget?.style.left ? this.divTarget?.style.left : "0px";

    // 缓存left不为零的元素
    if (parseInt(w)) {
      this.tmpDivTarget = this.divTarget;
    }

    // 判断路由锁
    if (this.canRoute) {
      this.handleGotoChatContent(clientname, clientid, roomid, key);
    }
    // 解开路由锁
    this.canRoute = true;
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

    // 开始跳转到 chatciew页面
    this.$router.push({
      name: "ChatView",
      params: {
        username: this.$store.getLocalUsername() ?? "",
        clientid: this.$store.getLocalClientid() ?? "",
      },
    });
  }

  // 消息通知操作
  private notification(chatBox: ChatBoxtype) {
    if (window.Notification) {
      // 权限允许
      if (window.Notification.permission === "granted") {
        // 请求权限
        if (!chatBox.self)
          new Notification(chatBox.clientname as string, {
            body: chatBox.content,
            icon: chatBox.avatar,
          });
          // 权限不允许
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

  // 创建userobject数据
  private buildUserObject(chatBox: ChatBoxtype) {
    // 判断self是否为true,是true就证明是自己发送的消息,否则就是别人发送的信息
    if (chatBox.self) {
      let clientid: string = chatBox.clientid as string;
      // 判断clientid是否存在于userObject,存在就修改content
      if (this.userObject[clientid]) {
        this.userObject[clientid].lastContent = chatBox.content;
        this.$db.saveUserListDataToDB(clientid, this.userObject[clientid]);
      } else {
        // 否则新创建一个obj
        let obj = {
          clientname: chatBox.clientname,
          clientid: chatBox.clientid,
          avatar: `${this.$api.rootUrl}/public/${chatBox.clientid}/avatar/${chatBox.clientid}_avatar.jpg`,
          lastContent: chatBox.content,
          unreadchatNumber: 0,
          roomid: chatBox.roomid,
        };
        // 添加状态到userObject
        this.$set(this.userObject, clientid, obj);
        // 保存状态到数据库
        this.$db.saveUserListDataToDB(clientid, obj);
      }
    } else {
      // 这里是他人发送消息处理
      let clientid: string = chatBox.myid as string;
      // 判断是否存在于userObject
      if (this.userObject[clientid]) {
        this.userObject[clientid].lastContent = chatBox.content;
        this.userObject[clientid].unreadchatNumber += 1;
        // 计算总红点数
        this.reddot += 1;
        // 保存状态到数据库
        this.$db.saveUserListDataToDB(clientid, this.userObject[clientid]);
      } else {
        // 新创建一个obj
        let obj = {
          clientname: chatBox.myname,
          clientid: chatBox.myid,
          avatar: chatBox.avatar,
          lastContent: chatBox.content,
          unreadchatNumber: 1,
          roomid: chatBox.roomid,
        };
        // 添加状态到userObject
        this.$set(this.userObject, clientid, obj);
        // 保存状态到数据库
        this.$db.saveUserListDataToDB(clientid, obj);
        // 计算总红点数
        this.reddot += 1;
      }
    }
  }

  async mounted() {
    let ele: HTMLElement | null = document.getElementById("sw_userlist");
    if (ele) ele.scrollTop = parseInt(sessionStorage.getItem("st") ?? "1");

    // 首次加载需要加载userlist数据库
    let data = await this.$db.getUserListDataFromDB();
    for (const key in data) {
      if (key !== "userlist" && key !== "indexDBId") {
        if (data[key].unreadchatNumber) {
          // 刷新红点
          this.reddot += data[key].unreadchatNumber;
        }
        // 初始化 userObject
        this.$set(this.userObject, key, data[key]);
      }
    }
  }

  // 监听路由变化
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