<template>
  <div class="home">
    <userlist />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import userlist from "@/page/userList/userlist.vue"

@Component({
  components: {
    userlist
  },
})
export default class Home extends Vue {
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