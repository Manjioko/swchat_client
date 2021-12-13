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
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {

  private keyhandle(event: KeyboardEvent) {
    this.$nextTick(() => {
      let el = event.target as HTMLElement;
      this.$emit("input", el.innerText);
      el.innerText = "";
    });
  }

  private inputBlurHandle2(event:FocusEvent) {
    (this.$refs.setInput as HTMLElement).blur()
  }

  private inputBlurHandle(event: TouchEvent) {
    let isNotSame:boolean = (event.target as HTMLElement) !== (this.$refs.setInput as HTMLElement)
    if (isNotSame) {
      (this.$refs.setInput as HTMLElement).blur();
    }
  }

  mounted() {
    document.addEventListener("touchend", this.inputBlurHandle);
  }
  beforeDestroy() {
    document.removeEventListener("touchend",() => {})
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .swc-input {
    background-color: rgb(245, 239, 239);
    width: 100vw;
    padding: 20px 0 40px 0;
    position: fixed;
    bottom: 0;
    left: 0;
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
