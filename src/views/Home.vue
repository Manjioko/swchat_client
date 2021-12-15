<template>
  <div class="home">
    <!-- <div :style="{margin:'50px'}">{{resizewindow}}</div> -->
    <!-- <div
      v-for="(item, index) in chatArr"
      :key="index + 'chartbox'"
      :class="{ chatboxClass: item.self, chatboxClass_other: !item.self }"
    >
      <s-chatbox :sContent="item.content" :sSelf="item.self" />
    </div> -->
    <topbar  />
    <!-- <input-content @input="inputTextHandle" :style="inputStyle"/> -->

    <chatview />
    <!-- <input type="text" class="testInput" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import inputContent from "@/components/inputContent/inputContent.vue";
import chatview from "@/components/chatView/chatview.vue"
import topbar from "@/components/topBar/topbar.vue"

interface ChatBoxtype {
  readonly time: number;
  readonly content: string;
  readonly self: boolean;
}
@Component({
  components: {
    inputContent,
    chatview,
    topbar
  },
})
export default class Home extends Vue {
  private resizewindow: any = ''
  private inputStyle: object = {}
  private chatArr: Array<ChatBoxtype> = [
    { time: 1, content: "这是一首无情的歌", self: false },
    { time: 2, content: "这是一首有情的歌", self: true },
    { time: 3, content: "这是一首歌", self: false },
  ];

  private inputTextHandle(event: string) {
    let chatContent: ChatBoxtype = {
      time: new Date().getTime(),
      content: event,
      self: true,
    };
    this.chatArr.push(chatContent);
  }

  mounted() {
    window.addEventListener('resize',()=>{
      const resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
      this.resizewindow =  resizeHeight
      
    })
    
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .testInput {
    margin-top: 70vh;
  }
  .home {
    // transform: translate3d(0,0,0);
    // background-color: rgb(95, 28, 202);
    // height: 100vh;
    overflow-y: scroll;
    // height: 30vh;
  }
  .chatboxClass {
    text-align: end;
    margin-right: 20px;
    margin-top: 20px;
  }
  .chatboxClass_other {
    text-align: start;
    margin-left: 10px;
    margin-top: 20px;
  }
}
// .home {
//   background-color: gray;
// }
</style>