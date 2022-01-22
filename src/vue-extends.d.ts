import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
      readonly $bus: any,
      readonly $axios: any,
      readonly $api: any,
      readonly $store: any,
      readonly $db: any,
      readonly $mqtt:any,
    }
  }