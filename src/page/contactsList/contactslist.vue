<template>
  <div>
    <div class="sw-contactslist">
      <div
        class="sw-contactslist-outLevel-class"
        @click="handleGotoChatContent"
        v-for="x in 5"
        :key="x"
      >
        <div class="sw-contactslist-avatar-class">
          <s-avatar
            :sSrc="require('../../assets/avatar_other.jpg')"
          />
        </div>

        <div class="sw-contactslist-text-class">
          <div>林清焰</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Chat_content extends Vue {
  private handleGotoChatContent() {
    // this.$router.push("/chatview");
  }

  beforeCreate() {}
  created() {}
  beforeMount() {}
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
  .sw-contactslist {
    width: 100vw;
    height: 78vh;
    position: fixed;
    top: 7vh;
    background-color: rgb(255, 255, 255);
    overflow: auto;
    padding-bottom: 3vh;
    -webkit-overflow-scrolling: touch;
  }
  .sw-contactslist-outLevel-class {
    height: 4vh;
    min-height: 40px;
    background-color: #fdfdfd;
    text-align: start;
    padding: 1.2vh;
    border-bottom: 1px solid #e0dfdf;
  }
  .sw-contactslist-avatar-class {
    float: left;
  }
  .sw-contactslist-text-class {
    font-size: 5vw;
    width: 72vw;
    // background: red;
    margin-left: 3vw;
    margin-top: 0.5vh;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    div:nth-child(1) {
      display: contents;
    }
  }
}
</style>