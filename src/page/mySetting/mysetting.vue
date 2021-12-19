<template>
  <div>
    <div class="sw-mysetting">
      <div class="sw-mysetting-settingbar-class">
        <div class="sw-mysetting-avatar-class">
          <s-avatar
            :sSrc="require('../../assets/avatar_other.jpg')"
            :sWidth="80"
            :sHeight="80"
          />
        </div>

        <div class="sw-mysetting-text-class">
          <div>林清焰💯</div>
        </div>
        <div class="sw-mysetting-id-class">
          <span>ID: </span>
          <span>LingQingYan</span>
        </div>
      </div>
        <!-- collect -->
      <div class="sw-mysetting-collect-class">
        <div class="sw-mysetting-bar-start">
          <img
            :src="require('../../assets/collect.png')"
            alt="collect"
            class="sw-mysetting-img-class"
          />
        </div>
        <div class="sw-mysetting-bar-middle">收藏</div>
        <div class="sw-mysetting-bar-end">
          <img
            :src="require('../../assets/arrow-right.png')"
            alt="right-arrow"
            class="sw-mysetting-img-class"
          />
        </div>
      </div>
        <!-- setting -->
      <div class="sw-mysetting-setting-class">
        <div class="sw-mysetting-bar-start">
          <img
            :src="require('../../assets/setting.png')"
            alt="setting
            "
            class="sw-mysetting-img-class"
          />
        </div>
        <div class="sw-mysetting-bar-middle">设置</div>
        <div class="sw-mysetting-bar-end">
          <img
            :src="require('../../assets/arrow-right.png')"
            alt="right-arrow"
            class="sw-mysetting-img-class"
          />
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
    // this.$router.push("/chatview");
  }

  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
}
</script>

<style scoped lang="scss">
$imgWidth: 30px;
$imgHeight: 30px;
$barBackgroundColor: #e5ecef;
@media screen and(max-width: 600px) {
  .sw-mysetting {
    width: 100vw;
    height: 78vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-mysetting-settingbar-class {
    height: 12vh;
    min-height: 106px;
    // background: radial-gradient(#4b84a3, transparent);
    background-color: $barBackgroundColor;
    text-align: start;
    padding: 1.2vh;
  }
  .sw-mysetting-avatar-class {
    float: left;
  }
  .sw-mysetting-text-class {
    font-size: 7vw;
    width: 50vw;
    // background: red;
    margin-left: 3vw;
    margin-top: 0.5vh;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    div:nth-child(1) {
      display: contents;
    }
  }
  .sw-mysetting-id-class {
    display: inline-block;
    margin-left: 13px;
    margin-top: 5px;
    color: #7a7a7a;
  }
  .sw-mysetting-collect-class {
    background: $barBackgroundColor;
    height: 6vh;
    width: 100vw;
    margin-top: 30px;
    text-align: start;
  }
  .sw-mysetting-img-class {
    width: $imgWidth;
    height: $imgHeight;
  }
  .sw-mysetting-bar-start {
    float: left;
    padding-left: 3vw;
    padding-top: 1vh;
  }
  .sw-mysetting-bar-end {
    float: right;
    margin-right: 2vw;
    margin-top: 1vh;
  }
  .sw-mysetting-bar-middle {
    display: inline-block;
    margin-left: 3vw;
    margin-top: 1.3vh;
    font-size: 18px;
  }
  .sw-mysetting-setting-class {
      @extend .sw-mysetting-collect-class;
      margin-top: 2px;
  }
}
</style>