<template>
  <div class="home">
      <topbar :username="username">
        <div class="home-topbar-extend-component">
          <div class="home-topbar-extend-component-adddiv" v-show="showaddPlus">
            <img :src="require('../assets/addplus.png')" alt="addplus">
          </div>
          <div class="home-topbar-extend-component-adddiv" v-show="showadd">
            <img :src="require('../assets/add.png')" alt="add">
          </div>
        </div>
      </topbar>
      <userlist v-show="togglePageArr[0]" />
      <contactlist v-show="togglePageArr[1]" />
      <mysetting v-show="togglePageArr[2]" />
      <bottombar @bartoggle="handleBarToggleProp" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import userlist from "@/page/userList/userlist.vue"
import topbar from "@/components/topBar/topbar.vue";
import bottombar from "@/components/bottomBar/bottombar.vue"
import contactlist from "@/page/contactsList/contactslist.vue"
import mysetting from "@/page/mySetting/mysetting.vue"

@Component({
  components: {
    userlist,
    topbar,
    bottombar,
    contactlist,
    mysetting
  },
})
export default class Home extends Vue {
  private togglePageArr: Array<Boolean> = [true, false, false];
  private username: string = "燕语"
  private showadd: boolean = false
  private showaddPlus: boolean = true
  private handleBarToggleProp(t: Array<Boolean>) {
    this.togglePageArr = t
    if(t[0]) {
      this.username = "燕语"
      this.showadd = false
      this.showaddPlus = true   
    } else if (t[1]) {
      this.username = "通讯录"
      this.showaddPlus = false
      this.showadd = true
    } else {
      this.username = "我"
      this.showaddPlus = false
      this.showadd = false
    }
  }
  updated() {}
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
  .home-topbar-extend-component {
    float: right;
  }
  .home-topbar-extend-component-adddiv {
    margin-top: 2vh;
    margin-right: 3vw;
    img {
      width: 6vw;
      height: 3vh;
    }
  }
}
// .home {
//   background-color: gray;
// }
</style>