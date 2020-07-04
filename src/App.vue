<template>
  <div class="vs-app">
    <div class="vs-toast" :class="{'vs-toast--inflated': isToastInflated}">
      <div class="vs-toast__inner">
        <span class="vs-toast__icon material-icons-round" aria-hidden="true">done</span>
        <span class="vs-toast__content">{{currentToast}}</span>
        <button @click="isToastInflated=false" class="vs-toast__close">
          <span class="material-icons-round vs-toast__close__icon" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
    <vs-sidebar :visible="isSidebarVisible" :onVisibleChange="onSidebarVisibleChange"></vs-sidebar>
    <vs-header></vs-header>
    <main class="vs-main">
      <div class="vs-container">
        <router-view></router-view>
      </div>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import VsHeader from "./components/VsHeader.vue";
import VsSidebar from "./components/VsSidebar.vue";

@Component({
  components: {
    VsHeader,
    VsSidebar
  },
  computed: mapState(["toasts"])
})
export default class App extends Vue {
  private toasts!: Array<string>;
  private isToastInflated: boolean = false;
  private currentToast: string | null = null;
  private isSidebarVisible: boolean = false;

  @Watch("toasts")
  watchToasts() {
    this.popToast();
  }

  onSidebarVisibleChange(newVal: boolean) {
    this.isSidebarVisible = newVal;
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