<template>
  <div
    class="sw-chatcontent"
    id="sw_chat_content"
    @scroll="throttle($event, chatcontentScrollHandle, 1000)()"
  >
    <div class="sw-chatcontent-loading-div-class" v-show="isLoadingShow">
      <img :src="require('../../assets/loading.png')" alt="loading..." />
    </div>
    <div
      v-for="(item, index) in chatArr"
      :key="index + 'chartbox'"
      :class="{ chatboxClass: item.self, chatboxClass_other: !item.self }"
    >
      <div
        :class="{
          's-chatbox-extend-con-class': item.self,
          's-chatbox-extend-con-other-class': !item.self,
        }"
      >
        <s-chatbox :sContent="item.content" :sSelf="item.self" />
      </div>
      <div
        :class="{
          's-chatbox-extend-img-class': item.self,
          's-chatbox-extend-img-other-class': !item.self,
        }"
      >
        <s-avatar :sSrc="item.avatar" />
      </div>
    </div>
    <!-- <p id="">hello workd</p> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { ChatBoxtype } from "vue/types/chatBoxType";

@Component({})
export default class Chat_content extends Vue {
  // 信息容器
  private chatArr: Array<ChatBoxtype> = [];
  // 计时器
  private timer: any = null;
  // 页面滚动高度
  private scrollTop: number = 0;
  // loding图标开关
  private isLoadingShow: boolean = false;
  // 初始聊天窗口高度
  private orginWindowHeight: number = 0;

  // 赖加载
  private async chatcontentScrollHandle(e: any) {
    let data = await this.$db.getDataFromDB(
      this.$store.getLocalRoomid(),
      this.chatArr.length
    );
    if (data.length) {
      this.chatArr = [...data, ...this.chatArr];
      this.$nextTick(() => {
        // chatArr 改变，意味聊天窗口变长，这里对应要将scrollTop定位到chatArr上次的长度上
        // 才自然不影响视觉，直观看到聊天内容变长
        e.target.scrollTop = e.target.scrollHeight - this.scrollTop;
        // 关闭loading图标
        this.isLoadingShow = false;
      });
    } else {
      this.isLoadingShow = false;
    }
  }

  // 节流器
  private throttle(event: any, method: Function, delay: number) {
    return () => {
      clearTimeout(this.timer);
      if (event.target.scrollTop === 0) {
        // 将元素的滚动高度赋予scrollTop
        this.scrollTop = event.target.scrollHeight;
        // 首次进入聊天窗口时不需要显示loading
        if (this.scrollTop !== this.orginWindowHeight) {
          // 打开loading图标
          this.isLoadingShow = true;
          this.timer = setTimeout(() => {
            // 执行赖加载函数
            method(event);
          }, delay);
        }
      } else {
        // 滚动时及时处理isLoadingShow,解决向下滚动也会出现loading图标的现象
        this.isLoadingShow ? this.isLoadingShow = false : ''
      }
    };
  }

  mounted() {
    let ele = document.getElementById("sw_chat_content");
    // 获取聊天窗口高度
    this.orginWindowHeight = ele ? ele.scrollHeight : 0;


    // 写入聊天记录
    this.$bus.$on(
      "chatview_update_chatArr_to_chatcontent",
      (newChatArr: Array<ChatBoxtype>) => {
        if (newChatArr) this.chatArr = [...newChatArr];
        // 进入页面时滚动到页面底部
        this.$nextTick(() => {
          if (ele) {
            ele.scrollTop = ele.scrollHeight;
          }
        });
      }
    );

    // 写入实时聊天消息
    this.$bus.$on(
      "chatview_send_chat_data_to_chatcontent",
      (data: ChatBoxtype) => {
        this.chatArr.push(data);
      }
    );

  }

  updated() {
    // let ele = document.getElementById("sw_chat_content");
    // if (ele) {
    //   ele.scrollTop = ele?.scrollHeight;
    // }
  }
  // 监听路由变化
  @Watch("$route")
  routerhandle(e: Route) {
    let ele: HTMLElement | null = document.getElementById("sw_chat_content");
    // 解决 IOS 滚动僵住的问题
    if (e.name == "ChatView") {  
      if (ele) ele.scrollTop = 1;
    } {
      // 切换回本页面时自动滚动到底部
      ele? ele.scrollTop = ele.scrollHeight : ''
    }
  }

  beforeDestroy() {
    // 离开页面时清理计时器
    clearTimeout(this.timer);
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
    user-select: none;
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
    user-select: none;
    image {
      -webkit-user-drag: none;
    }
  }
  .sw-chatcontent-loading-div-class {
    width: 20px;
    height: 20px;
    position: fixed;
    margin: 0 auto;
    top: 7vh;
    bottom: 0;
    right: 0;
    left: 0;
    img {
      width: 20px;
      height: 20px;
    }
    animation-name: loading;
    animation-duration: 0.3s;
    animation-iteration-count: infinite;
  }
  @keyframes loading {
    from {
      transform: rotate(60deg);
    }
    50% {
      transform: rotate(120deg);
    }
    to {
      transform: rotate(180deg);
    }
  }
}
</style>