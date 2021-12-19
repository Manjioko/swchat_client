<template>
  <div>
    <div class="sw-userlist">
      <div
        class="sw-userlist-outLevel-class"
        v-for="x in 30"
        :key="x"
        @click="handleGotoChatContent"
      >
        <div class="sw-userlist-avatar-class">
          <s-avatar
            :sSrc="require('../../assets/avatar_other.jpg')"
            :sWidth="50"
            :sHeight="50"
          />
        </div>

        <div class="sw-userlist-text-class">
          <div>林清焰</div>
          <div class="sw-userlist-chatcontent-class">
            我起床了哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
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
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Chat_content extends Vue {
  private handleGotoChatContent() {
    this.$router.push("/chatview");
  }

  private getdate(): string {
    let now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return (
      y +
      "-" +
      (m < 10 ? "0" + m : m) +
      "-" +
      (d < 10 ? "0" + d : d) +
      " " +
      now.toTimeString().substr(0, 8)
    );
  }
  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
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