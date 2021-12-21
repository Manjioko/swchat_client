<template>
  <div class="Login">
      <loginview />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import loginview from "@/page/logionView/loginview.vue"

@Component({
  components: {
      loginview
  },
})
export default class Login extends Vue {

    beforeCreate() {
        let username: string | null = localStorage.getItem("username")
        let password: string | null =  localStorage.getItem("password")
        if(username && password) {
            this.$router.replace("/home")
            // console.log("nothing")
        }
    }

}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {

}
</style>