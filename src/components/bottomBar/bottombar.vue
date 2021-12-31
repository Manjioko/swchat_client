<template>
  <div class="sw-bottombar">
    <div class="sw-bottombar-iconlist-class">
      <div
        @click="handleBottombarClick(0)"
        class="sw-bottombar-iconParentNode-class"
      >
        <div
          class="sw-bottombar-reddot-class"
          v-show="reddot"
        >
          <span>{{reddot}}</span>
        </div>
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
              ? require('../../assets/my_clicked.png')
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
  private reddot: number = 0;

  private handleBottombarClick(index: number) {
    this.barToggle = this.barToggle.map((_, i) => {
      if (i === index) {
        return true;
      }
      return false;
    });
    this.$emit("bartoggle", [...this.barToggle]);
    // console.log(this.barToggle);
  }
  mounted() {}
  created() {
    this.$bus.$on("userlist_send_reddot_number_to_bottombar",(reddot:number)=>{
      // console.log(reddot)
      this.reddot = reddot
    })
  }
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
    width: 7vw;
    height: 3.5vh;
  }
  .sw-bottombar-imgfontsize-class {
    font-size: 10px;
  }
  .sw-bottombar-textchangedcolor-class {
    color: #ff8378;
  }
  .sw-bottombar-iconParentNode-class {
    position: relative;
    width: 20vw;
    height: 10vh;
  }
  .sw-bottombar-reddot-class {
    background: red;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    font-size: 14px;
    color: white;
    position: absolute;
    right: 6px;
    top: -7px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>