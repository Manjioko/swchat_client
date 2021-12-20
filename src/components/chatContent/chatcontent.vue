<template>
  <div class="sw-chatcontent" id="sw_chat_content">
    <div
      v-for="(item, index) in chatArr"
      :key="index + 'chartbox'"
      :class="{ chatboxClass: item.self, chatboxClass_other: !item.self }"
    >
      <div :class="{'s-chatbox-extend-con-class': item.self, 's-chatbox-extend-con-other-class': !item.self}">
        <s-chatbox :sContent="item.content" :sSelf="item.self" />
      </div>
      <div :class="{'s-chatbox-extend-img-class': item.self,'s-chatbox-extend-img-other-class': !item.self}">
        <s-avatar
          :sSrc="
            item.self
              ? require('../../assets/avatar_my.jpg')
              : require('../../assets/avatar_other.jpg')
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

interface ChatBoxtype {
  readonly time: number;
  readonly content: string;
  self: boolean;
}

@Component({})
export default class Chat_content extends Vue {
  private chatArr: Array<ChatBoxtype> = [
    // { time: 1, content: "这是一首无情的歌", self: false },
    // { time: 2, content: "这是一首有情的歌", self: true },
    // { time: 3, content: "这是一首歌🎙🎶🎵", self: false },
    // { time: 3, content: "这是一首歌🎹👴", self: false },
    // { time: 3, content: "这是一首歌", self: false },
    // { time: 3, content: "这根本不是一首歌", self: true },
    // { time: 3, content: "这是啥歌", self: true },
    // { time: 3, content: "这是一首歌", self: false },
    // { time: 3, content: "这歌是乱唱的吧", self: true },
    // { time: 3, content: "这是一首歌", self: false },
    // { time: 3, content: "这是🎤🎤🎻", self: true },
    // { time: 3, content: "我叼", self: false },
    // { time: 3, content: "啥啊这是", self: true },
    // { time: 3, content: "来个表情", self: false },
    // { time: 3, content: "😂在💋", self: false },
    // { time: 3, content: "👀", self: true },
    // { time: 3, content: "狗东西🐕‍🦺", self: false },
  ];

  mounted() {
    this.$bus.$on("inputContent", (data: string) => {
      let text: ChatBoxtype = {
        time: new Date().getTime(),
        content: data,
        self: true,
      };
      this.chatArr.push(text);
      this.$socket.emit("otherSendMsg",text)
    });
    this.sockets.subscribe("otherSendMsg", (e: ChatBoxtype) => {
      console.log(e);
      e.self = false
      this.chatArr.push(e)
    });
  }
  updated() {
    let ele = document.getElementById("sw_chat_content");
    if (ele) {
      ele.scrollTop = ele?.scrollHeight;
    }
  }
  @Watch("$route")
  routerhandle(e: Route) {
    // 解决 IOS 滚动僵住的问题
    if(e.name == "ChatView") {
      let ele: HTMLElement | null = document.getElementById("sw_chat_content")
      if(ele)
        ele.scrollTop = 1
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-chatcontent {
    width: 100vw;
    height: 78.6vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-chatcontent-test {
    width: 100vw;
    height: 106vh;
  }
  .chatboxClass {
    text-align: end;
    margin: 1.3vh;
    // margin-bottom: 20px;
  }
  .chatboxClass_other {
    text-align: start;
    margin: 1.3vh;
    // margin-bottom: 20px;
  }
  .s-chatbox-extend-con-class {
    display: inline-block;
    margin-right: 4.3vw;
  }
  .s-chatbox-extend-img-class {
    float: right;
    user-select:none;
    image {
      -webkit-user-drag: none;
    }
  }

  .s-chatbox-extend-con-other-class {
    display: inline-block;
    margin-left: 1.4vw;
  }
  .s-chatbox-extend-img-other-class {
    float: left;
    user-select:none;
    image {
      -webkit-user-drag: none;
    }
  }
}
</style>