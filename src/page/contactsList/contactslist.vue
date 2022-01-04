<template>
  <div>
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
          @click="gotoChatviewHandle(user.username, user.userid)"
        >
          <div class="sw-contactslist-left-content">
            <div class="sw-contactslist-avatar-class">
              <s-avatar :sSrc="user.avatar" />
            </div>

            <div class="sw-contactslist-text-class">
              <div>{{ user.username }}</div>
            </div>
          </div>
        </div>
        <!-- delete div -->
        <div class="sw-contactlist-delete-outlayout-class">
          <div class="sw-contactlist-delete-text-class">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

interface userArrStruct {
  readonly username: String;
  readonly userid: String;
  readonly avatar: String;
}

@Component({
  components: {},
})
export default class Chat_content extends Vue {
  private userArr: Array<userArrStruct> = [];
  private clientName: string = "";

  private touchStartX: number = 0;
  private touchMoveX: number = 0;
  private moveWidth: number = 0;

  private divTarget: HTMLElement | null = null;

  private touchstartHandle(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.divTarget = event.target as HTMLElement;
  }

  private touchmoveHandle(event: TouchEvent) {
    // console.log(event.touches[0].clientX)
    this.touchMoveX = event.touches[0].clientX;
    this.moveWidth = this.touchStartX - this.touchMoveX;
    console.log(this.moveWidth);

    if (this.moveWidth > 20 && this.moveWidth <= 60) {
      let classname: string = this.divTarget?.parentElement?.className ?? "";
      let ele: HTMLElement = this.divTarget?.parentElement as HTMLElement;
      if (classname === "sw-contactslist-outLevel-class") {
        if (![...ele.classList].includes("movediv-left-animation")) {
          // ele.classList.remove("movediv-right-animation");
          ele.classList.add("movediv-left-animation");
        }
      }
    }
    if (this.moveWidth < -20 && this.moveWidth >= -60) {
      let classname: DOMTokenList | '' = this.divTarget?.parentElement?.classList ?? "";
      let ele: HTMLElement = this.divTarget?.parentElement as HTMLElement;
      console.log()
      if ([...classname]?.includes("sw-contactslist-outLevel-class")) {
        // console.log([...ele.classList])
        ele.classList.remove("movediv-left-animation");
      }
    }
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

  beforeCreate() {
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
  created() {}
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
    width: 15vw;
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

  .movediv-left-animation {
    animation-name: movdivleft;
    animation-duration: 0.2s;
    // animation-delay: 0.2s;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }
  @keyframes movdivleft {
    30% {
      transform: translateX(-15px);
    }
    50% {
      transform: translateX(-30px);
    }
    to {
      transform: translateX(-60px);
    }
  }

  .movediv-right-animation {
    animation-name: movdivright;
    animation-duration: 1s;
    // animation-delay: 0.2s;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    // background: green;
  }
  @keyframes movdivright {
    30% {
      transform: translateX(-60px);
    }
    50% {
      transform: translateX(-30px);
    }
    to {
      transform: translateX(0px);
    }
  }
  .sw-contactlist-delete-text-class {
    position: relative;
    top: 30%;
    color: white;

  }
}
</style>