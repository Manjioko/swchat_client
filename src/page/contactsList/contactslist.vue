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

  private gotoChatviewHandle(name: string, id: string) {
    this.$router.push({
      name: "ChatView",
      params: {
        username: name,
        clientid: id,
      },
    });
  }

  beforeCreate() {
    this.$axios
      .post(this.$api.getMyfriendList, {
        userid: localStorage.getItem("userid"),
      })
      .then((response: any) => {
        console.log(`用户好友列表: ${response.data}`);
        this.userArr = response.data;
        console.log(response);
        // 建立好友房连接
        let createRoomidArr = [];
        for (const fr of response.data) {
          let myid: string = localStorage.getItem("userid") ?? "";
          let clientid: string = fr.userid;
          let roomid: string =
            myid > clientid ? myid + clientid : clientid + myid;
          createRoomidArr.push(roomid);
        }
        console.log(createRoomidArr);
        // this.$socket.emit("createPrivateChatRoom", {
        //   roomidArr: createRoomidArr,
        // });
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