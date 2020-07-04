<template>
  <div>
    <h1 class="vs-title">
      <span>My</span>
      &nbsp;
      <span>Overview</span>
    </h1>
    <div class="row">
      <div class="col-xl-9">
        <div class="row">
          <div class="col-12">
            <div class="vs-section mb-4">
              <h2 class="vs-section__title fw-zebra">
                <span>My</span>
                &nbsp;
                <span>Stocks</span>
              </h2>
              <div class="vs-section__body">
                <vs-line-chart
                  class="vs-chart"
                  v-if="loadedLineChartData"
                  :options="lineChartOptions"
                  :chart-data="lineChartData"
                ></vs-line-chart>
                <div v-else class="vs-loader"></div>
                <div class="mb-4 vs-neo-tabs">
                  <button
                    v-for="o in lineChartDateRangeFilterOptions"
                    :key="o.id"
                    class="vs-neo-tabs__tab"
                    @click="lineChartDateRangeFilter = o.id"
                    :class="{'vs-neo-tabs__tab--active': lineChartDateRangeFilter === o.id}"
                    type="button"
                  >{{o.label}}</button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-6">
            <div class="vs-section vs-section--small mb-4">
              <h2 class="vs-section__title fw-zebra">
                <span>My</span>
                &nbsp;
                <span>Gains</span>
              </h2>
              <div class="vs-section__body overflow-auto">
                <div class="vs-loader" v-if="!loadedGains"></div>
                <table v-else-if="gains.length > 0">
                  <tbody>
                    <vs-stock-row
                      :stock="q"
                      :number="i + 1"
                      v-for="(q, i) in gains"
                      :key="q.symbol"
                    ></vs-stock-row>
                  </tbody>
                </table>
                <div v-else>
                  <img
                    class="w-50 mt-4 mb-3 mx-auto"
                    :src="require('../assets/no_gains.svg')"
                    alt="No gains recorded"
                  />
                  <div class="text-center text-grey">No gains recorded</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6">
            <div class="vs-section vs-section--small mb-4">
              <h2 class="vs-section__title fw-zebra">
                <span>My</span>
                &nbsp;
                <span>Losses</span>
              </h2>
              <div class="vs-section__body overflow-auto">
                <div class="vs-loader" v-if="!loadedLosses"></div>
                <table v-else-if="losses.length > 0">
                  <tbody>
                    <vs-stock-row
                      :stock="q"
                      :number="i + 1"
                      v-for="(q, i) in losses"
                      :key="q.symbol"
                    ></vs-stock-row>
                  </tbody>
                </table>
                <div v-else>
                  <img
                    class="w-50 mt-4 mb-3 mx-auto"
                    :src="require('../assets/no_losses.svg')"
                    alt="No losses recorded"
                  />
                  <div class="text-center text-grey">No losses recorded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3">
        <div class="vs-section vs-section--small mb-4">
          <h2 class="vs-section__title fw-zebra">
            <span>My</span>
            &nbsp;
            <span>News</span>
          </h2>
          <div>
            <div class="vs-section__body vs-loader" v-if="!loadedNews"></div>
            <div style="max-height:500px;" class="overflow-auto" v-else-if="news.length > 0">
              <vs-news v-for="n in news" :news="n" :key="n.url"></vs-news>
            </div>
            <div class="vs-section__body" v-else>
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
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Stock } from "../types";
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "./VsLineChart.vue";
import VsStockRow from "./VsStockRow.vue";
import VsNews from "./VsNews.vue";
import { mapState } from "vuex";
import chartRangeXaxesOptions from "../scripts/chartRangeXaxesOptions";
@Component({
  computed: mapState(["subbedStocks"]),
  components: {
    VsLineChart,
    VsStockRow,
    VsNews
  }
})
export default class VsDashboard extends Vue {
  private loadedLineChartData: boolean = false;
  private loadedGains = false;
  private loadedLosses = false;
  private loadedNews = false;
  private lineChartData: any = null;
  private gains: Array<any> = [];
  private losses: Array<any> = [];
  private news: Array<any> = [];
  private lineChartDateRangeFilter: string = "ONE_DAY";
  private subbedStocks!: Array<Stock>;
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
          gridLines: {
            drawBorder: false,
            display: false
          },
          ticks: {
            display: false,
            beginAtZero: false
          }
        }
      ],
      xAxes: [chartRangeXaxesOptions.ONE_DAY]
    }
  };

  private lineChartDateRangeFilterOptions: Array<object> = [
    { id: "ONE_DAY", label: "1d" },
    { id: "FIVE_DAYS", label: "5d" }
  ];

  @Watch("lineChartDateRangeFilter")
  watchLineChartDateRangeFilter(newVal: string) {
    switch (newVal) {
      case "ONE_DAY":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions.ONE_DAY;
        break;
      case "FIVE_DAYS":
        this.lineChartOptions.scales.xAxes[0] =
          chartRangeXaxesOptions.FIVE_DAYS;
        break;
    }
    this.loadLineChartData();
  }

  mounted() {
    this.loadLineChartData();
    this.loadGains();
    this.loadLosses();
    this.loadNews();
  }

  loadNews(): Promise<void> {
    this.loadedNews = false;
    return this.fetchNews().then(data => {
      this.news = data;
      this.loadedNews = true;
    });
  }

  loadLosses(): Promise<void> {
    this.loadedLosses = false;
    return this.fetchLosses().then(data => {
      this.losses = data;
      this.loadedLosses = true;
    });
  }

  loadGains(): Promise<void> {
    this.loadedGains = false;
    return this.fetchGains().then(data => {
      this.gains = data;
      this.loadedGains = true;
    });
  }

  loadLineChartData(): Promise<void> {
    this.loadedLineChartData = false;
    return this.fetchLineChartData().then(data => {
      this.lineChartData = data.data;
      this.loadedLineChartData = true;
    });
  }

  fetchNews(): Promise<any> {
    return fetch(`
      ${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/news?limit=3&symbols=${this.subbedStocks
      .map(s => s.symbol)
      .join(",")}
    `).then(r => r.json());
  }

  fetchLosses(): Promise<any> {
    return fetch(`
      ${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/quotes?limit=3&changeFilter=NEGATIVE&sort=CHANGE&sortDirection=DESC&symbols=${this.subbedStocks
      .map(s => s.symbol)
      .join(",")}
    `).then(r => r.json());
  }

  fetchGains(): Promise<any> {
    return fetch(`
      ${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/quotes?limit=3&changeFilter=POSITIVE&sort=CHANGE&sortDirection=DESC&symbols=${this.subbedStocks
      .map(s => s.symbol)
      .join(",")}
    `).then(r => r.json());
  }

  fetchLineChartData(): Promise<any> {
    return fetch(
      `${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/myStocksLineChart?chartRange=${
        this.lineChartDateRangeFilter
      }&symbols=${this.subbedStocks.map(s => s.symbol).join(",")}`
    ).then(r => r.json());
  }
}
</script>

<style>
</style>