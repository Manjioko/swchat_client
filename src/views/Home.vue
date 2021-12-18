<template>
  <div class="home">
      <topbar username="燕语" />
      <userlist />
      <bottombar @bartoggle="handleBarToggleProp" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import userlist from "@/page/userList/userlist.vue"
import topbar from "@/components/topBar/topbar.vue";
import bottombar from "@/components/bottomBar/bottombar.vue"

@Component({
  components: {
    userlist,
    topbar,
    bottombar
  },
})
export default class Home extends Vue {
  private togglePageArr: Array<Boolean> = [true, false, false];
  private handleBarToggleProp(t: Array<Boolean>) {
    this.togglePageArr = t
    // console.log(t)
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .testInput {
    margin-top: 70vh;
  }
  .home {
    // transform: translate3d(0,0,0);
    // background-color: rgb(95, 28, 202);
    // height: 100vh;
    overflow: hidden;
    // height: 30vh;
  }
  .chatboxClass {
    text-align: end;
    margin-right: 20px;
    margin-top: 20px;
  }
  .chatboxClass_other {
    text-align: start;
    margin-left: 10px;
    margin-top: 20px;
  }
}
// .home {
//   background-color: gray;
// }
</style>