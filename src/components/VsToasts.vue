<template>
  <div class="vs-toast" :class="{'vs-toast--inflated': inflated}">
    <div class="vs-toast__inner">
      <span class="vs-toast__icon material-icons-round">done</span>
      <span class="vs-toast__content">{{current}}</span>
      <button @click="deflate" class="vs-toast__close">
        <span class="material-icons-round vs-toast__close__icon" aria-hidden="true">close</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    VsToasts
  }
})
export default class VsToasts extends Vue {
  private inflated: boolean = false;
  private current?: string | null = null;
  private items: Array<string> = [];
  private running: boolean = false;

  @Prop({ required: true })
  private toasts!: Array<string>;

  @Watch("toasts")
  watchToasts(newVal: Array<string>) {
    this.items = newVal;
    this.next();
  }

  mounted() {
    this.current = this.toasts[0];
    this.next();
  }

  next() {
    if (this.running) return;
    if (this.items.length === 0) {
      this.running = false;
      return;
    }

    this.running = true;
    setTimeout(() => {
      this.current = this.items.shift();
      this.inflated = true;
      setTimeout(() => {
        this.inflated = false;
        setTimeout(() => {
          this.running = false;
          this.next();
        }, 1000);
      }, 5000);
    }, 1);
  }

  deflate() {
    this.inflated = false;
  }
}
</script>

<style scoped>
</style>