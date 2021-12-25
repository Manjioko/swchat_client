<template>
  <div>
    <div class="loginview-logintext-class">登陆燕语</div>
    <div class="LoginView">
      <div class="loginview-loginmsg-layout-class">
        <div class="loginview-loginmsg-class">
          <span class="loginview-text-class">账号</span>
          <input
            type="text"
            v-model="username"
            class="loginview-logininput-class"
          />
        </div>

        <div class="loginview-loginmsg-class">
          <span class="loginview-text-class">密码</span>
          <input
            type="password"
            v-model="password"
            class="loginview-logininput-class"
          />
        </div>
        <div class="loginview-login-submit-class">
          <button
            class="loginview-login-submit-button-class"
            @click="handleSubmit"
          >
            登陆/注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import uniqueId from "@/utils/uniqueid";

@Component({
  components: {},
})
export default class LoginView extends Vue {
  private username: string = "";
  private password: string = "";
  private handleSubmit() {
    if (!this.username || !this.password) {
      alert("账号或密码还未输入");
    } else {
      this.$axios
        .post(this.$api.registerandlogin, {
          username: this.username,
          password: this.password,
        })
        .then((response: any) => {
          let { success, userid, check, correct } = response.data;
          // 创建新用户
          if (success) {
            localStorage.setItem("username", this.username);
            localStorage.setItem("password", this.password);
            localStorage.setItem("userid", userid);
            alert(`用户 ${this.username} 创建成功`)
            this.$router.replace("/home");
          }
          // 账号密码正确
          else if(check && correct) {
            localStorage.setItem("username", this.username);
            localStorage.setItem("password", this.password);
            localStorage.setItem("userid", userid);
            this.$router.replace("/home");
          }
          // 账号或密码错误
          else if(check && !correct) {
            alert('账号或密码错误,请重新登陆')
          }
          else {
            alert('注册账号失败,请联系管理员')
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .LoginView {
    width: 100vw;
    height: 50vh;
    // background-color: cadetblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .loginview-logininput-class {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid rgb(121, 118, 118);
    background-color: #fff;
    width: 55vw;
    height: 3vh;
    outline: none;
    font-size: 20px;
  }
  .loginview-loginmsg-layout-class {
    background: #fff;
    height: 22vh;
    min-height: 200px;
    border-radius: 10px;
    width: 93vw;
    box-shadow: 3px 2px 10px #afaeae;
  }
  .loginview-loginmsg-class {
    padding: 10px;
  }
  .loginview-text-class {
    font-size: 20px;
    margin-right: 8px;
    vertical-align: sub;
    color: #7e7e7e;
  }
  .loginview-login-submit-class {
    display: inline-block;
    margin: 20px;
  }
  .loginview-login-submit-button-class {
    width: 70vw;
    height: 40px;
    border: none;
    outline: none;
    background: #41e5a8;
    border-radius: 10px;
    box-shadow: 1px 2px 6px #afadad;
    font-size: 20px;
    color: #ffffff;
  }
  .loginview-logintext-class {
    display: inline-block;
    margin: 10px;
    font-size: 30px;
  }
}
</style>