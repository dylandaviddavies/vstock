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

<script>
export default {
  props: {
    type: {
      type: String
    }
  },
  methods: {
    isError() {
      return this.type === "error";
    }
  }
};
</script>

<style>
</style>