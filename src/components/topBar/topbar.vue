<template>
  <div class="sw-topbar" ref="sw_topbar">
    <div class="topbar-back-class" @click="topbarBackHandle" v-show="showBack">
      <img
        :src="require('../../assets/back.png')"
        alt=""
        class="topbar-back-img-Class"
      />
    </div>
    <div class="topbar-back-username-class">
      {{ reconnect ? reconnect : username }}
    </div>
    <div class="topbar-more-class" @click="topbarBackHandle" v-show="showMore">
      <img
        :src="require('../../assets/more.png')"
        alt=""
        class="topbar-more-img-Class"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Chat_content extends Vue {
  @Prop(String) readonly username: string | undefined;
  @Prop(Boolean) readonly showBack!: boolean;
  @Prop(Boolean) readonly showMore!: boolean;
  private reconnect: any = ''
  private topbarBackHandle() {
    this.$router.go(-1)
    // alert("back");
  }
  mounted() {}
  created() {
    this.$bus.$on("websocketListener_reconnecting",(reconnect:number) => {
      
      // this.reconnect = reconnect
      switch(reconnect) {
        case 0:
          this.reconnect = "正在连接..."
          return
        case 1:
          this.reconnect = false
          return
        case 2:
          this.reconnect = "未连接"
          return
      }
    })
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-topbar {
    width: 100vw;
    height: 7vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    background-color: rgba(243, 240, 240, 0.596);
    text-align: left;
    user-select: none;
  }
  .topbar-back-img-Class {
    width: 10vw;
    height: 5vh;
    float: left;
    margin-top: 1vh;
  }
  .topbar-back-username-class {
    font-size: 19px;
    width: 60vw;
    height: 4vh;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 1.2vh;
    margin: auto;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .topbar-more-img-Class {
    width: 6vw;
    height: 3vh;
    float: right;
    margin-top: 2vh;
    margin-right: 2vh;
  }
  .topbar-back-class {
        width: 15vw;
    height: 7vh;
    display: inline-block;
  }
  .topbar-more-class {
    // display: inline-block;
    float: right;
  }
}
</style>