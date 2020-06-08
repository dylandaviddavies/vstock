<template>
  <div>
    <div class="vs-toast" :class="{'vs-toast--inflated': isToastInflated}">
      <div class="vs-toast__inner">
        <span class="vs-toast__icon material-icons-round">done</span>
        <span class="vs-toast__content">{{currentToast}}</span>
        <button @click="isToastInflated=false" class="vs-toast__close">
          <span class="material-icons-round vs-toast__close__icon" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
    <vs-header></vs-header>
    <main class="vs-main">
      <router-view></router-view>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import VsHeader from "./components/VsHeader.vue";

@Component({
  components: {
    VsHeader
  },
  computed: mapState(["toasts"])
})
export default class App extends Vue {
  private toasts!: Array<string>;
  private isToastInflated: boolean = false;
  private currentToast: string | null = null;

  @Watch("toasts")
  watchToasts() {
    this.popToast();
  }

  popToast() {
    if (this.isToastInflated) return;

    this.$store.dispatch("popToast").then(t => {
      if (t == null) return;

      this.currentToast = t;

      this.isToastInflated = true;

      setTimeout(() => {
        this.isToastInflated = false;

        setTimeout(() => {
          this.currentToast = null;

          this.popToast();
        }, 1000);
      }, 4000);
    });
  }
}
</script>

<style scoped>
</style>