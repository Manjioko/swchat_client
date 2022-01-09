<template>
  <div>
    <!-- <div class="loginview-logintext-class">登陆燕语</div> -->
    <topbar :showBack="true" />
    <div class="remarkFriend">
      <div class="remarkFriend-layout-class">
          <div class="remarkFriend-beforefriendname-class">{{friendName}}</div>
        <div class="remarkFriend-friendname-class">
          <span class="remarkFriend-nametext-class">新备注:</span>
          <input
            type="text"
            v-model="remarkfriendname"
            class="remarkFriend-nameinput-class"
          />
        </div>

        <div class="remarkFriend-addbutton-class">
          <button
            class="remarkFriend-addbutton-submit-button-class"
            @click="remarkFriendHandle"
          >
            添加备注
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import topbar from "@/components/topBar/topbar.vue"

@Component({
  components: {
    topbar,
  },
})
export default class remarkFriend extends Vue {
    private remarkfriendname: string = ''
    private friendName: string = this.$store.getLocalClientname()

    private remarkFriendHandle() {
        this.$axios
        .post(this.$api.remarkFriend, {
            clientAlias:this.remarkfriendname,
            clientid: this.$store.getLocalClientid(),
            userid: this.$store.getLocalUserid()
        })
        .then((response: any) => {
            console.log(response.data)
        })
        .catch((error: any) => {
          console.log(error);
        });
    }

    beforeCreate() {
      this.$bus.$on("contactslist_refresh_client_data_remark",(e:boolean) => {
        if(e) {
          this.friendName = this.$store.getLocalClientname()
        }
      })
    }

}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .remarkFriend {
    width: 100vw;
    height: 50vh;
    // background-color: cadetblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .remarkFriend-nameinput-class {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid rgb(121, 118, 118);
    background-color: #fff;
    width: 55vw;
    height: 3vh;
    outline: none;
    font-size: 20px;
  }
  .remarkFriend-layout-class {
    background: #fff;
    height: 22vh;
    min-height: 200px;
    border-radius: 10px;
    width: 93vw;
    padding-top: 30px;
    box-shadow: 3px 2px 10px #afaeae;
  }
  .remarkFriend-friendname-class {
    padding: 15px;
  }
  .remarkFriend-nametext-class {
    font-size: 20px;
    margin-right: 8px;
    vertical-align: sub;
    color: #7e7e7e;
  }
  .remarkFriend-addbutton-class {
    display: inline-block;
    margin: 20px;
  }
  .remarkFriend-addbutton-submit-button-class {
    width: 80vw;
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
  .remarkFriend-beforefriendname-class {
      font-size: 25px;
  }
}
</style>