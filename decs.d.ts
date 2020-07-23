declare module "v-click-outside"
declare module "vue-progressbar" {
  import { PluginFunction } from "vue";

  export const install: PluginFunction<{}>;

  module "vue/types/vue" {
    interface Vue {
      $Progress: any;
    }
  }
}