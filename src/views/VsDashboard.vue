<template>
  <div>
    <div class="row">
      <div class="col-xl-8">
        <div class="vs-section vs-section--small mb-4">
          <div>
            <div class="vs-section__body vs-loader" v-if="!loadedNews"></div>
            <div class="vs-news-hero-wrapper" v-else-if="news.length > 0">
              <vs-news-hero class="mb-3" :news="news[0]"></vs-news-hero>
              <div class="vs-news-substories mb-3">
                <vs-news-substory v-for="(n, i) in news.slice(1, 5)" :key="i" :news="n"></vs-news-substory>
              </div>
              <vs-news-card class="mb-3" v-for="(n, i) in news.slice(5)" :key="i" :news="n"></vs-news-card>
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
      <div class="col-xl-4">
        <div class="row">
          <div class="col-12" v-if="loadedTopPicks">
            <div class="vs-section mb-4">
              <h2 class="vs-section__title fw-zebra">
                <span>Top</span>
                &nbsp;
                <span>Picks</span>
              </h2>
              <div class="vs-section__body">
                <div class="vs-scrollable-row">
                  <vs-mini-stock-card :stock="s" v-for="s in topPicks" :key="s.symbol"></vs-mini-stock-card>
                </div>
              </div>
            </div>
          </div>
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

          <div class="col-12">
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
          <div class="col-12">
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
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Stock } from "../types";
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "../components/VsLineChart.vue";
import VsStockRow from "../components/VsStockRow.vue";
import VsNewsHero from "../components/VsNewsHero.vue";
import VsNewsCard from "../components/VsNewsCard.vue";
import VsNewsSubstory from "../components/VsNewsSubstory.vue";
import { mapState } from "vuex";
import chartRangeXaxesOptions from "../scripts/chartRangeXaxesOptions";
@Component({
  computed: mapState(["subbedStocks"]),
  components: {
    VsLineChart,
    VsStockRow,
    VsNewsHero,
    VsNewsCard,
    VsNewsSubstory
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
  private topPicks: Array<any> = [];
  private loadedTopPicks: boolean = false;
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
    this.loadTopPicks();
  }

  loadTopPicks(): Promise<void> {
    this.loadedTopPicks = false;
    return this.fetchTopPicks().then(data => {
      this.topPicks = data;
      this.loadedTopPicks = false;
    });
  }

  fetchTopPicks(): Promise<Array<any>> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/trendingQuotes
    `).then(r => r.json());
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
      }/api/v1/news?limit=8&symbols=${this.subbedStocks
      .map(s => s.symbol)
      .join(",")}
    `).then(r => r.json());
  }

  fetchLosses(): Promise<Array<any>> {
    return fetch(`
      ${
        process.env.VUE_APP_VSTOCK_API_URL
      }/api/v1/quotes?limit=3&changeFilter=NEGATIVE&sort=CHANGE&sortDirection=DESC&symbols=${this.subbedStocks
      .map(s => s.symbol)
      .join(",")}
    `).then(r => r.json());
  }

  fetchGains(): Promise<Array<any>> {
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