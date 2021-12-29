<template>
  <div>
    <div class="sw-contactslist">
      <div
        class="sw-contactslist-outLevel-class"
        v-for="user in userArr"
        :key="user.userid"
        @click="gotoChatviewHandle(user.username, user.userid)"
      >
        <div class="sw-contactslist-avatar-class">
          <s-avatar :sSrc="user.avatar" />
        </div>

        <div class="sw-contactslist-text-class">
          <div>{{ user.username }}</div>
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
  created() {
  }
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
    height: 4vh;
    min-height: 40px;
    background-color: #fdfdfd;
    text-align: start;
    padding: 1.2vh;
    border-bottom: 1px solid #e0dfdf;
  }
  .sw-contactslist-avatar-class {
    float: left;
  }
  .sw-contactslist-text-class {
    font-size: 5vw;
    width: 72vw;
    // background: red;
    margin-left: 3vw;
    margin-top: 0.5vh;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    div:nth-child(1) {
      display: contents;
    }
  }
}
</style>