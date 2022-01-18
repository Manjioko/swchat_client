<template>
  <div>
    <s-alter
      :sMsg="showDeleteMsg"
      v-if="showDeleteMsg"
      @sYes="deleteYesHandle"
      @sNo="deleteNoHandle"
    />
    <div
      class="sw-contactslist"
      @touchstart="touchstartHandle($event)"
      @touchmove="touchmoveHandle($event)"
    >
      <!-- for list div -->
      <div
        class="sw-contactslist-forlist-class"
        v-for="user in userArr"
        :key="user.userid"
      >
        <!-- outlevel div -->
        <div
          class="sw-contactslist-outLevel-class"
          @touchend="touchendHandle(user.username, user.userid)"
        >
            <div class="sw-contactslist-avatar-class">
              <s-avatar :sSrc="user.avatar" draggable="false" />
            </div>

            <div class="sw-contactslist-text-class">
              <div>{{ user.alias ? user.alias : user.username }}</div>
            </div>
          </div>


        <!-- delete div -->
        <div
          class="sw-contactlist-delete-outlayout-class"
          @click="deleteHandle(user.userid, user.username)"
        >
          <div class="sw-contactlist-delete-text-class">删除</div>
        </div>
        <div
          class="sw-contactlist-remark-outlayout-class"
          @click="remarkHandle(user.userid, user.username)"
        >
          <div class="sw-contactlist-remark-text-class">备注</div>
        </div>
          <!-- remark end -->
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

interface userArrStruct {
  readonly username: String;
  readonly userid: String;
  readonly avatar: String;
}

@Component({
  components: {},
})
export default class Chat_content extends Vue {
  // 渲染list的数据
  private userArr: Array<userArrStruct> = [];
  private clientName: string = "";

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
  //提示用户删除操作
  private showDeleteMsg: string = "";
  // 用于从userObject删除client数据的缓存clientid
  private clientid: string = "";

  // 更新用户信息到usrlist
  @Watch("userArr")
  userArrChangedHandle() {
    this.$bus.$emit("contactlist_send_userArr_data_to_userlist",[...this.userArr])
  }

  // 手指触碰到list时触发这个函数
  private touchstartHandle(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.divTarget = event.target as HTMLElement;

    // 定位元素到 sw-contactslist-outLevel-class
    while (
      this.divTarget &&
      ![...this.divTarget.classList].includes("sw-contactslist-outLevel-class")
    ) {
      this.divTarget = this.divTarget?.parentElement as HTMLElement;
    }

    // 获取this.divTarget.style.left 值
    let w: string = this.divTarget?.style.left
      ? this.divTarget?.style.left
      : "0";
    if (parseInt(w) !== 0) {
      this.canRoute = false;
      // 设置过渡效果
      if (this.divTarget?.style) {
        this.divTarget.style.transitionDuration = "0.5s";
        this.divTarget.style.transitionTimingFunction = "ease";
        this.divTarget.style.left = "0px";
      }
    }

    // 每次只能有一个单位能被左划
    let tmpW: string = this.tmpDivTarget?.style.left
      ? this.tmpDivTarget?.style.left
      : "0";
    if (parseInt(tmpW) !== 0) {
      // 锁死路由
      this.canRoute = false;
      // 解决点击删除备注时页面出现向右划动现象
      let eleClassList = [...(event.target as HTMLElement).classList];
      let isRightRemarkEle =
        eleClassList.includes("sw-contactlist-remark-outlayout-class") ||
        eleClassList.includes("sw-contactlist-remark-text-class");
      let isRightDeleteEle =
        eleClassList.includes("sw-contactlist-delete-outlayout-class") ||
        eleClassList.includes("sw-contactlist-delete-text-class");
      let isright = isRightRemarkEle || isRightDeleteEle;

      // 设置过渡效果
      if (this.tmpDivTarget?.style && !isright) {
        this.tmpDivTarget.style.transitionDuration = "0.5s";
        this.tmpDivTarget.style.transitionTimingFunction = "ease";
        this.tmpDivTarget.style.left = "0px";
      }
    }
  }

  // 手指移动
  private touchmoveHandle(event: TouchEvent) {
    // 如果存在transition，就清除它，主要是为了划动时不受动画的干扰
    if (this.divTarget?.style.transition) this.divTarget.style.transition = "";
    // 跳转开关关掉，主要是为了防止划动结束后不会触发跳转
    this.canRoute = false;
    // 计算划动时元素的坐标
    this.touchMoveX = event.touches[0].clientX;
    // 计算划动的距离
    this.moveWidth = this.touchStartX - this.touchMoveX;

    // 处理事件 移动元素
    if (this.moveWidth > 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(
          this.divTarget.style.left ? this.divTarget.style.left : "0"
        );
        if (w > -120 && w !== -120) this.divTarget.style.left = w - 3 + "px";
      }
    }
    // 处理事件 移动元素
    if (this.moveWidth < 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(this.divTarget.style.left);
        if (w < 0) this.divTarget.style.left = w + 3 + "px";
      }
    }
  }

  // 手指松开
  private touchendHandle(name: string, id: string) {
    // 松手时加入动画
    if (this.divTarget?.style) {
      let w: number = parseInt(this.divTarget.style.left);
      this.divTarget.style.transitionDuration = "0.2s";
      this.divTarget.style.transitionTimingFunction = "ease";
      // 向左划
      if (this.moveWidth !== 0 && this.moveWidth > 0) {
        if (w < -10) {
          this.divTarget.style.left = "-120px";
        } else {
          this.divTarget.style.left = "0px";
        }
      }
    }

    let w: string = this.divTarget?.style.left
      ? this.divTarget?.style.left
      : "0px";

    // 缓存left不为零的元素
    if (parseInt(w)) {
      this.tmpDivTarget = this.divTarget;
    }

    // 查看左划没有归位的情况，如果没有，就正常跳转
    if (this.canRoute) {
      this.gotoChatviewHandle(name, id);
    }
    // 设置正常跳转开关
    this.canRoute = true;
  }

  private gotoChatviewHandle(name: string, clientid: string) {
    // 设置roomid
    let myid: string = this.$store.getLocalUserid() as string;
    let roomid: string = myid > clientid ? myid + clientid : clientid + myid;
    this.$store.setLocalRoomid(roomid);
    // 设置clientid
    this.$store.setLocalClientid(clientid);
    // 设置clientName
    this.$store.setLocalClientname(name);
    //更新chatview页面内的roomid 和 clientid
    this.$bus.$emit("contactslist_update_ids_chatview", {
      roomid: roomid,
      clientid: clientid,
      clientname: name,
    });

    // 进入页面时应先消除userlist页面的红点
    this.$bus.$emit("contactslist_clear_reddot_userlist", clientid);

    this.$router.push({
      name: "ChatView",
      params: {
        username: this.$store.getLocalUsername() ?? "",
        clientid: this.$store.getLocalClientid() ?? "",
      },
    });
  }

  private deleteHandle(clientid: string, clientname: string) {
    console.log(clientid);
    this.showDeleteMsg = `确定要删除 ${clientname} 吗?`;
    this.clientid = clientid;
  }

  private deleteYesHandle() {
    // 确认删除好友时发送请求
    this.$axios
      .post(this.$api.removeFriend, {
        userid: this.$store.getLocalUserid(),
        clientid: this.clientid,
      })
      .then((res: any) => {
        console.log(res);
        if (res.data) {
          // 刷新好友列表
          this.userArr = this.userArr.filter((e) => e.userid !== this.clientid);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
    this.showDeleteMsg = "";
  }
  private deleteNoHandle() {
    this.showDeleteMsg = "";
  }

  private remarkHandle(clientid: string, clientname: string) {
    // 设置clientid
    this.$store.setLocalClientid(clientid);
    // 设置clientName
    this.$store.setLocalClientname(clientname);

    // 更新 remark页面的clientname
    this.$bus.$emit("contactslist_refresh_client_data_remark", true);

    this.$router.push("/remarkfriend");
  }

  private postHanle() {
    let userid: string = this.$store.getLocalUserid()
    this.$axios
      .post(this.$api.getMyfriendList, {
        userid: userid,
      })
      .then((response: any) => {
        this.userArr = response.data;
        this.$db.saveContactListDataToDB(userid,response.data);
        // 建立好友房连接
        let createRoomidArr = [];
        for (const fr of response.data) {
          let myid: string = this.$store.getLocalUserid() ?? "";
          let clientid: string = fr.userid;
          let roomid: string =
            myid > clientid ? myid + clientid : clientid + myid;
          createRoomidArr.push(roomid);
        }
        //将全部好友加入私聊房间
        this.$bus.$emit(
          "contantslist_join_all_friends_to_private_room_websocketListener",
          createRoomidArr
        );
      })
      .catch(async (error: any) => {
        console.log(error);
        // 断线或者其他问题就从数据库拿联系人数据
        let data = await this.$db.getContactListDataFromDB(userid);
        this.userArr = data["list"];
      });
  }

  created() {
    this.postHanle();
    this.$bus.$on(
      "getfriend_refresh_page_contactslist",
      (addfriend: boolean) => {
        if (addfriend) {
          this.postHanle();
        }
      }
    );
    this.$bus.$on(
      "remark_need_to_refresh_contactlist_contactlist",
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.postHanle();
        }
      }
    );
  }
  // created() {}
  beforeMount() {}
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-contactslist {
    width: 100vw;
    height: 78vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-contactslist-outLevel-class {
    // height: 4vh;
    // width: 97vw;
    min-height: 40px;
    background-color: #fdfdfd;
    text-align: start;
    // padding: 1.2vh;
    // border-bottom: 1px solid #e0dfdf;

    // background: beige;
    width: 100%;
    height: 100%;
    position: relative;
    left: 0px;
    z-index: 1;
  }
  .sw-contactslist-avatar-class {
    float: left;
    padding-top: 12px;
    padding-left: 10px;
  }
  .sw-contactslist-text-class {
    font-size: 5vw;
    width: 50vw;
    // background: red;
    margin-left: 3vw;
    margin-top: 1.8vh;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    div:nth-child(1) {
      display: contents;
    }
    user-select: none;
  }

  .sw-contactslist-left-content {
    // padding: 15px;
    height: 100%;
  }

  .sw-contactslist-forlist-class {
    // display: flex;
    // justify-content: flex-start;
    // flex-wrap: nowrap;
    // align-content: center;
    // align-items: center;
    width: 100vw;
    height: 8vh;
    min-height: 60px;
    // background: cadetblue;
    border-bottom: 1px solid #e0dfdf;
    position: relative;
  }
  .sw-contactlist-delete-outlayout-class {
    width: 60px;
    height: 8vh;
    min-height: 60px;
    background: red;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    text-align: center;
    top: 0;
    right: 0;
  }

  .sw-contactlist-delete-text-class {
    position: relative;
    top: 30%;
    color: white;
    user-select: none;
  }

  .sw-contactlist-remark-outlayout-class {
    @extend .sw-contactlist-delete-outlayout-class;
    background-color: rgb(126, 126, 126);
    right: 60px;
  }

  .sw-contactlist-remark-text-class {
    @extend .sw-contactlist-delete-text-class;
  }
}
</style>