<template>
  <div>
    <vs-header></vs-header>
    <main class="vs-main">
      <router-view></router-view>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script>
import VsHeader from "./components/VsHeader.vue";
export default {
  components: {
    VsHeader
  }
};
</script>

<style scoped>
</style>