<template>
  <div class="sw-userlist">
      <topbar username="SwChat" />
      <bottombar />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import topbar from "@/components/topBar/topbar.vue";
import bottombar from "@/components/bottomBar/bottombar.vue"

@Component({
    components: {
        topbar,
        bottombar
    }
})
export default class Chat_content extends Vue {
  mounted() {}
}
</script>

<style scoped lang="scss">
@media screen and(max-width: 600px) {
}
</style>