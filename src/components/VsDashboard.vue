<template>
  <div>
    <h1 class="vs-title">
      <span class="material-icons-round vs-title__icon" aria-hidden="true">dashboard</span>
      Dashboard
    </h1>
    <vs-line-chart :chart-data="lineChartData"></vs-line-chart>
  </div>
</template>

<script>
export default {
  data() {
    null;
  },
  mounted() {
    this.loadLineChartData();
  },
  loadLineChartData() {
    /*
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/quotes?symbols=${stockSymbol}`
    )
      .then(r => r.json())
      .then(data => (this.lineChartData = data));
    */
  }
};
</script>

<style>
</style>