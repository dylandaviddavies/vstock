<template>
  <div>
    <div v-if="loaded">
      <div class="row">
        <div class="col-lg-4 d-flex flex-column align-items-center">
          <div class="d-none d-lg-block">
            <div class="vs-stat mb-5">
              <div class="vs-stat__title justify-content-center fw-zebra">
                <span>Current</span>&nbsp;
                <span>Price</span>
              </div>
              <div class="vs-stat__value">{{stock.quote.latestPrice}}</div>
              <span class="vs-stat__change" :class="[changeClass]">
                <span class="mb-2">{{stock.quote.change > 0 ? '+' : ''}}{{stock.quote.change}}</span>
                <span
                  style="font-size:.7em;"
                >({{stock.quote.change > 0 ? '+' : ''}}{{changePercentage}})</span>
              </span>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div>
            <router-link
              to="/trending"
              class="vs-chip mb-2 vs-chip--small m-0 mb-3 vs-chip--primary"
              v-if="loadedTrendingData && trendingData.rank != null && trendingData.rank > 0"
            >
              <span class="material-icons-round vs-chip__icon" aria-hidden="true">trending_up</span>
              #{{trendingData.rank}} Trending
            </router-link>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <h1 class="vs-title">{{stock.quote.companyName}}</h1>
              <h2 class="vs-subtitle">{{stock.quote.symbol}}</h2>
            </div>
            <div>
              <vs-btn-group>
                <vs-btn-group-action
                  v-if="isSubscribed"
                  :onClick="openUnsubscribeModal"
                  aria-controls="unsubscribeModal"
                >Unsubscribe</vs-btn-group-action>
                <vs-btn-group-action
                  v-else
                  :onClick="subscribe"
                  aria-controls="unsubscribeModal"
                >Subscribe</vs-btn-group-action>
              </vs-btn-group>
              <vs-modal
                :isOpen="isUnsubscribeModalOpen"
                :headAsColumn="true"
                :onClose="closeUnsubscribeModal"
                :img="require('../assets/add_stock_img.svg')"
                id="unsubscribeModal"
              >
                <template v-slot:title>Unsubscribe</template>
                <template v-slot:body>
                  <p
                    class="my-4 text-center text-grey"
                  >Are you sure you want to unsubscribe from this stock?</p>
                  <div class="row justify-content-center">
                    <div class="col-12 mb-4 col-lg-4">
                      <button
                        @click="unsubscribe"
                        class="w-100 vs-btn vs-btn--lg vs-btn--danger vs-btn--fill"
                      >Yes, I'm sure</button>
                    </div>
                    <div class="col-12 mb-4 col-lg-4">
                      <button
                        @click="closeUnsubscribeModal"
                        class="w-100 vs-btn vs-btn--default vs-btn--lg vs-btn--danger vs-btn--fill"
                      >No, I'm not</button>
                    </div>
                  </div>
                </template>
              </vs-modal>
            </div>
          </div>
          <div class="d-flex flex-column align-items-center d-lg-none mb-5">
            <div class="vs-stat">
              <div class="vs-stat__title justify-content-center fw-zebra">
                <span>Current</span>&nbsp;
                <span>Price</span>
              </div>
              <div class="vs-stat__value">{{stock.quote.latestPrice}}</div>
              <span class="vs-stat__change" :class="[changeClass]">
                <span class="mb-2">{{stock.quote.change > 0 ? '+' : ''}}{{stock.quote.change}}</span>
                <span
                  style="font-size:.7em;"
                >({{stock.quote.change > 0 ? '+' : ''}}{{changePercentage}})</span>
              </span>
            </div>
          </div>
          <div class="mb-4">
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
          <div class="vs-section pt-1 mb-4">
            <h2 class="vs-section__title mb-3">News</h2>
            <div>
              <div class="vs-section__body vs-loader" v-if="!loadedNews"></div>
              <div style="max-height:500px;" v-else-if="news.length > 0">
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
    <div v-else class="vs-loader"></div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Stock } from "../types";
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "./VsLineChart.vue";
import VsNews from "./VsNews.vue";
import VsModal from "./VsModal.vue";
import VsBtnGroup from "./VsBtnGroup.vue";
import VsBtnGroupAction from "./VsBtnGroupAction.vue";
import chartRangeXaxesOptions from "../scripts/chartRangeXaxesOptions";
import { mapState } from "vuex";

@Component({
  components: {
    VsLineChart,
    VsModal,
    VsNews,
    VsBtnGroup,
    VsBtnGroupAction
  },

  computed: mapState(["subbedStocks"])
})
export default class VsStockOverview extends Vue {
  private subbedStocks!: Array<Stock>;
  private isUnsubscribeModalOpen: boolean = false;
  private loadedNews: boolean = false;
  private news: Array<any> = [];
  private loadedLineChartData: boolean = false;
  private loaded: boolean = false;
  private stock: any = null;
  private lineChartData: any = null;
  private lineChartDateRangeFilter: string = "ONE_DAY";
  private trendingData: any = null;
  private loadedTrendingData: boolean = false;
  private lineChartDateRangeFilterOptions: Array<object> = [
    { id: "ONE_DAY", label: "1d" },
    { id: "FIVE_DAYS", label: "5d" }
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

  @Watch("lineChartDateRangeFilter")
  watchLineChartDateRangeFilter(newVal: string) {
    switch (newVal) {
      case "ONE_DAY":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions[newVal];
        break;
      case "FIVE_DAYS":
        this.lineChartOptions.scales.xAxes[0] = chartRangeXaxesOptions[newVal];
        break;
    }
    this.loadLineChartData();
  }

  get isSubscribed(): boolean {
    return this.subbedStocks
      .map(s => s.symbol)
      .includes(this.stock.quote.symbol);
  }

  get changeClass(): string {
    if (this.stock.quote.change > 0) return "vs-stat__change--good";
    if (this.stock.quote.change < 0) return "vs-stat__change--bad";
    return "vs-stat__change--neutral";
  }

  get changePercentage(): string {
    if (this.stock.quote.latestPrice === 0) return "0%";
    return (
      Math.round(
        (this.stock.quote.change / this.stock.quote.latestPrice) * 100
      ) /
        100 +
      "%"
    );
  }

  subscribe() {
    this.$store.dispatch("subscribeStock", {
      symbol: this.stock.quote.symbol
    } as Stock);
    this.$store.dispatch("addToast", `Subscribed to stock`);
  }

  unsubscribe() {
    this.closeUnsubscribeModal();
    this.$store.dispatch("unsubscribeStockBySymbol", this.stock.quote.symbol);
    this.$store.dispatch("addToast", `Unsubscribed from stock`);
  }

  openUnsubscribeModal() {
    this.isUnsubscribeModalOpen = true;
  }

  closeUnsubscribeModal() {
    this.isUnsubscribeModalOpen = false;
  }

  mounted() {
    this.load();
  }

  load() {
    this.loaded = false;
    this.fetchStock()
      .then(data => {
        this.stock = data;
        this.loaded = true;
      })
      .then(() => {
        this.loadLineChartData();
        this.loadNews();
        this.loadTrendingData();
      });
  }

  loadNews(): Promise<void> {
    this.loadedNews = false;
    return this.fetchNews().then(data => {
      this.news = data;
      this.loadedNews = true;
    });
  }

  loadTrendingData(): Promise<void> {
    this.loadedTrendingData = false;
    return this.fetchTrendingData().then(data => {
      this.trendingData = data;
      this.loadedTrendingData = true;
    });
  }

  fetchTrendingData(): Promise<any> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/trending/${this.stock.quote.symbol}
    `).then(r => r.json());
  }

  fetchNews(): Promise<any> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/news?limit=3&symbols=${this.$route.params.symbol}
    `).then(r => r.json());
  }

  loadLineChartData(): Promise<void> {
    this.loadedLineChartData = false;
    return this.fetchLineChartData().then(data => {
      data.data.datasets.forEach((d: any) => {
        d.borderColor = "#3fa9f5 ";
      });
      this.lineChartData = data.data;
      this.loadedLineChartData = true;
    });
  }

  fetchLineChartData(): Promise<any> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/myStocksLineChart?chartRange=${this.lineChartDateRangeFilter}&symbols=${this.$route.params.symbol}`
    ).then(r => r.json());
  }

  fetchStock(): Promise<any> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/stock/${this.$route.params.symbol}`
    ).then(r => r.json());
  }
}
</script>

<style scoped>
</style>