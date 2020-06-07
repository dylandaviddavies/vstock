<template>
  <div>
    <vs-toasts :toasts="toasts"></vs-toasts>
    <vs-header></vs-header>
    <main class="vs-main">
      <router-view></router-view>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import VsHeader from "./components/VsHeader.vue";
import VsToasts from "./components/VsToasts.vue";

@Component({
  components: {
    VsHeader,
    VsToasts
  },
  computed: mapState(["toasts"])
})
export default class App extends Vue {}
</script>

<style scoped>
</style>