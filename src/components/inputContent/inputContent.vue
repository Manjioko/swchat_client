<template>
  <div class="swc-input">
    <div
      contenteditable="true"
      class="editeDiv"
      enterkeyhint="send"
      @keydown.enter.prevent="keyhandle"
      @blur="inputBlurHandle2"
      ref="setInput"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop(Number) readonly scrollTop: number | undefined;
  private scrollTop2: number = 0;

  private keyhandle(event: KeyboardEvent) {
    this.$nextTick(() => {
      let el = event.target as HTMLElement;
      // this.$emit("input", el.innerText);
      this.$bus.$emit("inputContent",el.innerText)
      el.innerText = "";
    });
  }

  private inputBlurHandle2(event: FocusEvent) {
    (this.$refs.setInput as HTMLElement).blur();
  }

  private inputBlurHandle(event: TouchEvent | Event) {
    let isNotSame: boolean =
      (event.target as HTMLElement) !== (this.$refs.setInput as HTMLElement);
    if (isNotSame) {
      (this.$refs.setInput as HTMLElement)?.blur();
    }
  }

  private handleScrollTop(event: TouchEvent) {
    let isSame: boolean =
      (event.target as HTMLElement) === (this.$refs.setInput as HTMLElement);
      if(isSame) {
        let ele = document.getElementById('sw_chat_content');
        if(ele) {
          ele.scrollTop = ele?.scrollHeight;
        }
      }
  }

  mounted() {
    document.addEventListener("touchmove", this.inputBlurHandle);
    document.addEventListener("click", this.inputBlurHandle);
    document.addEventListener("touchend", this.handleScrollTop);
  }
  beforeDestroy() {
    document.removeEventListener("touchmove", () => {});
    document.removeEventListener("click", () => {});
    document.addEventListener("touchend", this.handleScrollTop);
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .swc-input {
    background-color: rgb(245, 239, 239);
    width: 100vw;
    padding: 2vh 0 4vh 0;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    .editeDiv {
      display: inline-block;
      outline: none;
      width: 90vw;
      min-height: 3vh;
      max-height: 30vh;
      overflow-y: auto;
      text-align: start;
      background-color: rgb(255, 255, 255);
      border: none;
      border-radius: 10px;
      font-size: 20px;
      padding: 1vh;
    }
  }
}
</style>
