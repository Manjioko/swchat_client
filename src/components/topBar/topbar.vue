<template>
  <div
  class="sw-topbar"
  ref="sw_topbar"
  >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class Chat_content extends Vue {

  mounted() {
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
        background-color: rgb(243, 240, 240);
    }
}
</style>