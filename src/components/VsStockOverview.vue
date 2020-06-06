<template>
  <div>
    <div v-if="loaded">
      <h1 class="vs-title">{{stock.quote.companyName}}</h1>
      <h2 class="vs-subtitle">{{stock.quote.symbol}}</h2>
      <div class="row">
        <div class="col-lg-9 mb-4 col-md-8">
          <div class="vs-box">
            <div class="vs-box__title">
              <span>My</span>
              &nbsp;
              <span>Timeline</span>
            </div>
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
            <vs-line-chart
              v-if="loadedLineChartData"
              :options="lineChartOptions"
              :chart-data="lineChartData"
            ></vs-line-chart>
            <div v-else class="vs-loader"></div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4">
          <div class="vs-box vs-box--small">
            <div class="vs-box__title">
              <span>My</span>
              &nbsp;
              <span>News</span>
            </div>
            <div class="vs-loader" v-if="!loadedNews"></div>
            <div v-else-if="news.length > 0">
              <vs-news v-for="n in news" :news="n" :key="n.url"></vs-news>
            </div>
            <div v-else>
              <img
                class="w-50 mt-4 mb-3 mx-auto"
                :src="require('../assets/no_news.svg')"
                alt="No news to report"
              />
              <div class="text-center text-grey">No news to report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="vs-loader"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "./VsLineChart.vue";
import VsNews from "./VsNews.vue";
import chartRangeXaxesOptions from "../scripts/chartRangeXaxesOptions";

@Component({
  components: {
    VsLineChart,
    VsNews
  }
})
export default class VsStockOverview extends Vue {
  private loadedNews = false;
  private news: Array<any> = [];
  private loadedLineChartData: boolean = false;
  private loaded: boolean = false;
  private stock: any = null;
  private lineChartData: any = null;
  private lineChartDateRangeFilter: string = "ONE_DAY";
  private lineChartDateRangeFilterOptions: Array<object> = [
    { id: "ONE_DAY", label: "1d" },
    { id: "FIVE_DAYS", label: "5d" },
    { id: "ONE_MONTH", label: "1m" }
  ];
  private lineChartOptions = {
    responsive: true,
    elements: {
      point: {
        radius: 0
      }
    },
    maintainAspectRatio: false,
    spanGaps: true,
    legend: {
      display: false
    },
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "index",
      intersect: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false
          }
        }
      ],
      xAxes: [chartRangeXaxesOptions.ONE_DAY]
    }
  };

  @Watch("lineChartDateRangeFilter")
  watchLineChartDateRangeFilter(newVal: string) {
    switch (newVal) {
      case "ONE_DAY":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions[newVal];
        break;
      case "FIVE_DAYS":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions[newVal];
        break;
      case "ONE_MONTH":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions[newVal];
        break;
    }
    this.loadLineChartData();
  }

  mounted() {
    this.load();
  }

  load() {
    this.loaded = false;
    this.fetch()
      .then(data => {
        this.stock = data;
        this.loaded = true;
      })
      .then(() => {
        this.loadLineChartData();
        this.loadNews();
      });
  }

  loadNews(): Promise<void> {
    this.loadedNews = false;
    return this.fetchNews().then(data => {
      this.news = data;
      this.loadedNews = true;
    });
  }

  fetchNews(): Promise<any> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/news?limit=3&symbols=${this.$route.params.symbol}
    `).then(r => r.json());
  }

  loadLineChartData(): Promise<void> {
    this.loadedLineChartData = false;
    return this.fetchLineChartData().then(data => {
      this.lineChartData = data.data;
      this.loadedLineChartData = true;
    });
  }

  fetchLineChartData(): Promise<any> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/myStocksLineChart?chartRange=${this.lineChartDateRangeFilter}&symbols=${this.$route.params.symbol}`
    ).then(r => r.json());
  }

  fetch(): Promise<any> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/stock/${this.$route.params.symbol}`
    ).then(r => r.json());
  }
}
</script>

<style scoped>
</style>