<template>
  <div class="vs-alert" :class="{'vs-alert--error': isError}">
    <div aria-hidden="true" class="vs-alert__icon material-icons-round">
      <template v-if="isError">error_outline</template>
    </div>
    <div class="vs-alert__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class MyComponent extends Vue {
  @Prop({ required: true }) readonly type!: string;
  public isError(): boolean {
    return this.type === "error";
  }
}
</script>

<style>
</style>