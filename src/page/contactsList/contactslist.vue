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
          <div class="sw-contactslist-left-content">
            <div class="sw-contactslist-avatar-class">
              <s-avatar :sSrc="user.avatar" draggable="false" />
            </div>

            <div class="sw-contactslist-text-class">
              <div>{{ user.username }}</div>
            </div>
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
  // @Prop(Array) private toggle!:Array<boolean>
  private userArr: Array<userArrStruct> = [];
  private clientName: string = "";

  private touchStartX: number = 0;
  private touchMoveX: number = 0;
  private moveWidth: number = 0;

  private divTarget: HTMLElement | null = null;
  private tmpDivTarget: HTMLElement | null = null;
  private canRoute: boolean = true;
  private showDeleteMsg: string = "";
  private clientid: string = "";

  private touchstartHandle(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.divTarget = event.target as HTMLElement;

    while (
      this.divTarget &&
      ![...this.divTarget.classList].includes("sw-contactslist-outLevel-class")
    ) {
      this.divTarget = this.divTarget?.parentElement as HTMLElement;
    }

    let w: string = this.divTarget?.style.left
      ? this.divTarget?.style.left
      : "0";
    if (parseInt(w) !== 0) {
      this.canRoute = false;
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
      this.canRoute = false;
      if (this.tmpDivTarget?.style) {
        this.tmpDivTarget.style.transitionDuration = "0.5s";
        this.tmpDivTarget.style.transitionTimingFunction = "ease";
        this.tmpDivTarget.style.left = "0px";
      }
    }
  }

  private touchmoveHandle(event: TouchEvent) {

    // 如果存在transition，就清除它，主要是为了划动时不受动画的干扰
    if (this.divTarget?.style.transition) this.divTarget.style.transition = "";
    // 跳转开关关掉，主要是为了防止划动结束后不会触发跳转
    this.canRoute = false;
    // 计算划动时元素的坐标
    this.touchMoveX = event.touches[0].clientX;
    // 计算划动的距离
    this.moveWidth = this.touchStartX - this.touchMoveX;

    // 处理事件
    if (this.moveWidth > 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(
          this.divTarget.style.left ? this.divTarget.style.left : "0"
        );
        if (w > -120 && w !== -120) this.divTarget.style.left = w - 3 + "px";
      }
    }
    if (this.moveWidth < 0) {
      if (this.divTarget?.style) {
        let w: number = parseInt(this.divTarget.style.left);
        if (w < 0) this.divTarget.style.left = w + 3 + "px";
      }
    }
  }

  private touchendHandle(name: string, id: string) {
    // console.log(e)
    // 松手时加入动画
    if (this.divTarget?.style) {
      let w: number = parseInt(this.divTarget.style.left);
      this.divTarget.style.transitionDuration = "0.2s";
      this.divTarget.style.transitionTimingFunction = "ease";
      // 分两种情况
      // 向左划
      if (this.moveWidth !== 0 && this.moveWidth > 0) {
        if (w < -10) {
          this.divTarget.style.left = "-120px";
        } else {
          this.divTarget.style.left = "0px";
        }
      }
    }

    // 导航到chatview
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
    this.$axios
      .post(this.$api.getMyfriendList, {
        userid: this.$store.getLocalUserid(),
      })
      .then((response: any) => {
        this.userArr = response.data;
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
      .catch((error: any) => {
        console.log(error);
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
    // background: cadetblue;
    border-bottom: 1px solid #e0dfdf;
    position: relative;
  }
  .sw-contactlist-delete-outlayout-class {
    width: 60px;
    height: 8vh;
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