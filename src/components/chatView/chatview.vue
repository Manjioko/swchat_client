<template>
  <div class="sw-chatview">
    <topbar />
    <chatcontent />
    <inputcontent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import chatcontent from "@/components/chatContent/chatcontent.vue";
import inputcontent from "@/components/inputContent/inputContent.vue";
import topbar from "@/components/topBar/topbar.vue";

@Component({
  components: {
    chatcontent,
    inputcontent,
    topbar,
  },
})
export default class Chat_view extends Vue {

  private scrollTop: number = 0

  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-chatview {
    width: 100vw;
    height: 100vh;
    // height: 100%;
    // position: relative;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    background-color: rgb(0, 218, 65);
    overflow: hidden;
    // position: relative;
  }
}
</style>