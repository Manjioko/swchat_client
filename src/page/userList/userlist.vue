<template>
  <div>
    <div class="sw-userlist" id="sw_userlist">
      <!-- <div id="xxxxxx"></div> -->
      <div
        class="sw-userlist-outLevel-class"
        v-for="(item, key, index) in userObject"
        :key="key"
        @click="handleGotoChatContent"
      >
        <div class="sw-userlist-avatar-class">
          <s-avatar
            :sSrc="item.avatar"
            :sWidth="50"
            :sHeight="50"
          />
        </div>

        <div class="sw-userlist-text-class">
          <div>{{item.clientname}}</div>
          <div class="sw-userlist-chatcontent-class">
            {{item.lastContent}}
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
  private userList: Array<any> = [];
  private userObject: any = {}

  private handleGotoChatContent() {
    let ele: HTMLElement | null = document.getElementById("sw_userlist");
    let scrolltop: string = ele?.scrollTop.toString() ?? "";
    sessionStorage.setItem("st", scrolltop);
    this.$router.push("/chatview");
  }

  created() {
    this.$bus.$on(
      "websocketListener_send_chatbox_to_userlist",
      (chatBox: ChatBoxtype) => {
        let clientid = chatBox.clientid
        if(!this.userObject[clientid as string]) {
          let obj = {
            clientname: chatBox.clientname,
            avatar: chatBox.avatar,
            lastContent: chatBox.content,
            unreadchatNumber: 1
          }
          this.$set(this.userObject,clientid as string,obj)
        } else {
          this.userObject[clientid as string].lastContent = chatBox.content;
          this.userObject[clientid as string].unreadchatNumber += 1;
        }
      }
    );
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
}
</style>