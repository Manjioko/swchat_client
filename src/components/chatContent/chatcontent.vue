<template>
  <div class="sw-chatcontent">
      <!-- <div  class="sw-chatcontent-test">chatcontent</div> -->
      <div>content</div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
})
export default class Chat_content extends Vue {

}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
    .sw-chatcontent {
        width: 100vw;
        height: 100vh;
        background-color: rgb(54, 90, 85);
        overflow: scroll;
    }
    .sw-chatcontent-test {
        width: 100vw;
        height: 106vh;
        
    }
}
</style>