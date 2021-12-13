<template>
  <div class="home">
    <!-- <div>hello world </div> -->
    <div
      v-for="(item, index) in chatArr"
      :key="index + 'chartbox'"
      :class="{ chatboxClass: item.self, chatboxClass_other: !item.self }"
    >
      <s-chatbox :sContent="item.content" :sSelf="item.self" />
    </div>
    <input-content @input="inputTextHandle" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import inputContent from "@/components/inputContent/inputContent.vue";

interface ChatBoxtype {
  readonly time: number;
  readonly content: string;
  readonly self: boolean;
}
@Component({
  components: {
    inputContent,
  },
})
export default class Home extends Vue {
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
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .home {
    background-color: rgb(255, 255, 255);
    height: 98vh;
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