<template>
  <div
  class="sw-topbar"
  :style="{
    top: scrollTop + 'px'
  }"
  ref="sw_topbar"
  >
    <div>{{scrollTop}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class Chat_content extends Vue {
  private scrollTop: number = 0
  mounted() {
    window.addEventListener('scroll',(e: any)=>{
      
      // this.scrollTop = h
      // (this.$refs.sw_topbar as HTMLElement).style.top = (window.pageYOffset + window.innerHeight - 25) + 'px';
    //  let h = document.documentElement.scrollTop
      // this.$bus.$emit('scrollTop',h)
    })
    this.$bus.$on('scrollTop', (e:number) => {
      this.scrollTop = e
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
        background-color: rgb(243, 240, 240);
    }
}
</style>