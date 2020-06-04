<template>
  <div>
    <h1 class="vs-title">
      <span class="material-icons-round vs-title__icon" aria-hidden="true">dashboard</span>
      Dashboard
    </h1>
    <div class="row">
      <div class="vs-box col-md-8">
        <h2 class="vs-box__title">My Stocks</h2>
        <div class="vs-box__controls vs-chips d-flex flex-wrap">
          <button
            v-for="o in lineChartDateRangeFilterOptions"
            :key="o.id"
            class="vs-chip"
            @click="lineChartDateRangeFilter = o.id"
            :class="{'vs-chip--active': lineChartDateRangeFilter === o.id}"
            type="button"
          >{{o.label}}</button>
        </div>
        <vs-line-chart v-if="loadedLineChartData" :chart-data="lineChartData"></vs-line-chart>
        <div v-else class="vs-loader"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "./VsLineChart.vue";
import { mapState } from "vuex";

@Component({
  computed: mapState(["subscribedSymbols"]),
  components: {
    VsLineChart
  }
})
export default class VsDashboard extends Vue {
  private lineChartData: any = null;
  private lineChartDateRangeFilter: string = "ONE_DAY";
  private subscribedSymbols!: Array<string>;
  private loadedLineChartData: boolean = false;
  private lineChartDateRangeFilterOptions: Array<any> = [
    { id: "ONE_DAY", label: "1d" },
    { id: "FIVE_DAYS", label: "5d" },
    { id: "ONE_MONTH", label: "1m" }
    //{ id: "SIX_MONTHS", label: "6m" },
    //{ id: "ONE_YEAR", label: "1y" },
    //{ id: "MAX", label: "Max" }
  ];

  @Watch("lineChartDateRangeFilter")
  watchLineChartDateRangeFilter() {
    this.loadLineChartData();
  }

  mounted() {
    this.loadLineChartData();
  }

  loadLineChartData() {
    this.loadedLineChartData = false;
    return fetch(
      `${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/myStocksLineChart?chartRange=${
        this.lineChartDateRangeFilter
      }&symbols=${this.subscribedSymbols.join(",")}`
    )
      .then(r => r.json())
      .then(data => {
        this.lineChartData = data.data;
        this.loadedLineChartData = true;
      });
  }
}
</script>

<style>
</style>