<template>
  <div class="vs-btn-group" :class="{'vs-btn-group--open': isOpen}">
    <button @click="toggle" v-click-outside="clickOutside" class="vs-icon-btn">
      <span class="material-icons-round vs-icon-btn__icon" aria-hidden="true">more_horiz</span>
    </button>
    <ul class="vs-btn-group__actions">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class VsBtnGroup extends Vue {
  private isOpen: boolean = false;

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  clickOutside() {
    this.close();
  }
}
</script>

<style scoped>
</style>