<template>
  <div>
    <!-- <div class="loginview-logintext-class">登陆燕语</div> -->
    <topbar :showBack="true" />
    <div class="getFriend">
      <div class="getFriend-layout-class">
        <div class="getFriend-friendname-class">
          <span class="getFriend-nametext-class">好友</span>
          <input
            type="text"
            v-model="friendname"
            class="getFriend-nameinput-class"
          />
        </div>

        <div class="getFriend-addbutton-class">
          <button
            class="getFriend-addbutton-submit-button-class"
            @click="getFriendSubmitHandle"
          >
            添加好友
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
export default class getFriend extends Vue {
    private friendname: string = ''

    private getFriendSubmitHandle() {
        console.log(this.friendname)
        this.$axios
        .post(this.$api.getFriend, {
            friendname:this.friendname,
            userid: this.$store.getLocalUserid()
        })
        .then((response: any) => {
            console.log(response)
            let addfriend = response.data.addfriend
            let why = response.data.why
            if(addfriend) {
              alert("好友添加成功")
              this.$router.go(-1)
            } else {
              switch(why) {
                case 0:
                    alert("不能添加自己作为好友")
                    return
                case 1:
                    alert("账号不存在，请重新输入")
                    return
                case 3:
                    alert("不能重复添加已存在的好友")
                    return
              }
            }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }

}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .getFriend {
    width: 100vw;
    height: 50vh;
    // background-color: cadetblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .getFriend-nameinput-class {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid rgb(121, 118, 118);
    background-color: #fff;
    width: 55vw;
    height: 3vh;
    outline: none;
    font-size: 20px;
  }
  .getFriend-layout-class {
    background: #fff;
    height: 22vh;
    min-height: 200px;
    border-radius: 10px;
    width: 93vw;
    padding-top: 30px;
    box-shadow: 3px 2px 10px #afaeae;
  }
  .getFriend-friendname-class {
    padding: 15px;
  }
  .getFriend-nametext-class {
    font-size: 20px;
    margin-right: 8px;
    vertical-align: sub;
    color: #7e7e7e;
  }
  .getFriend-addbutton-class {
    display: inline-block;
    margin: 20px;
  }
  .getFriend-addbutton-submit-button-class {
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
}
</style>