<template>
  <div class="Login">
    <loginview />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import loginview from "@/page/logionView/loginview.vue";
// import websocketListener from "@/websocket/websocketListener"

@Component({
  components: {
    loginview,
  },
})
export default class Login extends Vue {
  beforeCreate() {
    let username: string | null = this.$store.getLocalUsername();
    let password: string | null = this.$store.getLocalPassword();
    let userid: string | null = this.$store.getLocalUserid();
    if (username && password && userid) {
      this.$router.replace("/home");
      // websocketListener(this,userid)
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
}
</style>