<template>
  <div class="sw-bottombar">
    <div class="sw-bottombar-iconlist-class">
      <div
        @click="handleBottombarClick(0)"
        class="sw-bottombar-iconParentNode-class"
      >
        <img
          :src="
            this.barToggle[0]
              ? require('../../assets/chat_clicked.png')
              : require('../../assets/chat.png')
          "
          alt="chat"
          class="sw-bottombar-icon-size-class"
        />
        <div
          class="sw-bottombar-imgfontsize-class"
          :class="{
            'sw-bottombar-textchangedcolor-class': this.barToggle[0],
          }"
        >
          聊天
        </div>
      </div>
      <div
        @click="handleBottombarClick(1)"
        class="sw-bottombar-iconParentNode-class"
      >
        <img
          :src="
            this.barToggle[1]
              ? require('../../assets/contacts_clicked.png')
              : require('../../assets/contacts.png')
          "
          alt="contacts"
          class="sw-bottombar-icon-size-class"
        />
        <div
          class="sw-bottombar-imgfontsize-class"
          :class="{
            'sw-bottombar-textchangedcolor-class': this.barToggle[1],
          }"
        >
          通讯录
        </div>
      </div>
      <div
        @click="handleBottombarClick(2)"
        class="sw-bottombar-iconParentNode-class"
      >
        <img
          :src="
            this.barToggle[2]
              ? require('../../assets/my_click.png')
              : require('../../assets/my.png')
          "
          alt="my"
          class="sw-bottombar-icon-size-class"
        />
        <div
          class="sw-bottombar-imgfontsize-class"
          :class="{
            'sw-bottombar-textchangedcolor-class': this.barToggle[2],
          }"
        >
          我
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Chat_content extends Vue {
  private barToggle: Array<Boolean> = [true, false, false];

  private handleBottombarClick(index: number) {
    this.barToggle = this.barToggle.map((_, i) => {
      if (i === index) {
        return true;
      }
      return false;
    });
    this.$emit("bartoggle",[... this.barToggle])
    // console.log(this.barToggle);
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-bottombar {
    position: fixed;
    bottom: 0;
    height: 12vh;
    width: 100vw;
    background: rgb(245, 239, 239);
  }
  .sw-bottombar-iconlist-class {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-top: 2vh;
    -webkit-tap-highlight-color: transparent;
  }
  .sw-bottombar-icon-size-class {
    width: 7.2vw;
    height: 3.8vh;
  }
  .sw-bottombar-imgfontsize-class {
    font-size: 10px;
    //   color: #1296db;
  }
  .sw-bottombar-textchangedcolor-class {
    color: #1296db;
  }
  .sw-bottombar-iconParentNode-class {
    width: 20vw;
    height: 10vh;
  }
}
</style>