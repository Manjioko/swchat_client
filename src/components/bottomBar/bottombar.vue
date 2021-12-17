<template>
  <div class="sw-bottombar">
    <div class="sw-bottombar-iconlist-class">
      <div>
        <img
          :src="require('../../assets/chat.png')"
          alt="chat"
          class="sw-bottombar-icon-size-class"
        />
        <div class="sw-bottombar-imgfontsize-class">聊天</div>
      </div>
      <div>
        <img
          :src="require('../../assets/contacts.png')"
          alt="contacts"
          class="sw-bottombar-icon-size-class"
        />
        <div class="sw-bottombar-imgfontsize-class">通讯录</div>
      </div>
      <div>
        <img
          :src="require('../../assets/my.png')"
          alt="my"
          class="sw-bottombar-icon-size-class"
        />
        <div class="sw-bottombar-imgfontsize-class">我</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Chat_content extends Vue {
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-bottombar {
    position: fixed;
    bottom: 0;
    height: 10vh;
    width: 100vw;
    background: rgb(245, 239, 239);
  }
  .sw-bottombar-iconlist-class {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin-top: 2vh;
  }
  .sw-bottombar-icon-size-class {
    width: 6vw;
    height: 3vh;
  }
  .sw-bottombar-imgfontsize-class {
      font-size: 10px;
    //   color: #1296db;
  }
}
</style>