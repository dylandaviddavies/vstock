<template>
  <li>
    <button
      @click="onClick"
      :aria-controls="ariaControls"
      class="vs-btn-group__action"
      type="button"
    >
      <slot></slot>
    </button>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsBtnGroupAction extends Vue {
  @Prop({ required: true })
  private onClick!: Function;
  @Prop({ required: false })
  private ariaControls!: string;
}
</script>

<style scoped>
</style>