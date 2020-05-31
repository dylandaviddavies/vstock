<template>
  <div>
    <vc-header></vc-header>
    <main class="vs-main">
      <router-view></router-view>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script>
import VcHeader from './components/VcHeader.vue';
export default {
  components: {
    VcHeader
  }
};
</script>

<style scoped>
</style>
