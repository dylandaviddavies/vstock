<template>
  <div v-if="loaded">
    <div class="row">
      <div class="col-12">
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
            <h1 class="vs-title mb-0">{{stock.quote.companyName}}</h1>
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
        <div class="mb-4">
          <div class="vs-section__body">
            <template v-if="loadedLineChartData">
              <div class="vs-stock-price mt-2 mb-4">
                <div class="vs-stock-price__value">${{stock.quote.latestPrice}}</div>
                <div
                  class="vs-stock-price__change mb-2"
                  :class="[getChangeClass(changeLineChartData)]"
                >
                  {{changeLineChartData > 0 ? `+$${changeLineChartData}` : `-$${changeLineChartData * -1}`}}
                  ({{changeLineChartData > 0 ? `+${getChangePercentage(lastLineChartData, changeLineChartData)}` : `${getChangePercentage(lastLineChartData, changeLineChartData)}`}})
                  <span
                    class="vs-text-subtext"
                    v-if="lineChartDateRangeFilter === 'ONE_DAY'"
                  >Today</span>
                  <span
                    class="vs-text-subtext"
                    v-else-if="lineChartDateRangeFilter === 'FIVE_DAYS'"
                  >Last 5 days</span>
                </div>
                <div
                  class="vs-stock-price__change mb-2"
                  :class="[getChangeClass(stock.quote.change)]"
                >
                  {{stock.quote.change > 0 ? `+$${stock.quote.change}` : `-$${stock.quote.change * -1}`}}
                  ({{stock.quote.change > 0 ? '+' : ''}}{{getChangePercentage(stock.quote.latestPrice, stock.quote.change)}})
                  <span
                    class="vs-text-subtext"
                  >Latest change</span>
                </div>
              </div>
              <vs-line-chart
                class="vs-chart"
                :options="lineChartOptions"
                :chart-data="lineChartData"
              ></vs-line-chart>
            </template>
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
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Stock, StyleState } from "../types";
import { Component, Vue, Watch } from "vue-property-decorator";
import VsLineChart from "../components/VsLineChart.vue";
import VsNews from "../components/VsNews.vue";
import VsModal from "../components/VsModal.vue";
import VsBtnGroup from "../components/VsBtnGroup.vue";
import VsBtnGroupAction from "../components/VsBtnGroupAction.vue";
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

  computed: mapState(["subbedStocks", "styleState"])
})
export default class VsStockOverview extends Vue {
  private styleState!: StyleState;
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

  @Watch("styleState")
  watchStyleState() {
    this.updateDatasetsBorderColor();
  }

  @Watch("loadedLineChartData")
  watchLoadedLineChartData(newVal: boolean) {
    if (newVal) this.updateDatasetsBorderColor();
  }

  @Watch("$route.params.symbol", { immediate: true, deep: true })
  watchRouteParamSymbol() {
    this.load();
  }

  get isSubscribed(): boolean {
    return this.subbedStocks
      .map(s => s.symbol)
      .includes(this.stock.quote.symbol);
  }

  get changeLineChartData() {
    return (
      Math.round(
        (this.lastLineChartData - this.firstLineChartData + Number.EPSILON) *
          100
      ) / 100
    );
  }

  getChangeClass(change: number): string {
    if (change > 0) return "vs-stock-price__change--good";
    if (change < 0) return "vs-stock-price__change--bad";
    return "vs-stock-price__change--neutral";
  }

  getChangePercentage(price: number, change: number): string {
    if (price === 0) return "0%";
    return Math.round((change / price) * 100) / 100 + "%";
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

  beforeDestroy() {
    this.$store.dispatch("setStyleState", StyleState.Default);
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

  get firstLineChartData(): number {
    if (this.lineChartData == null) return 0;
    return this.lineChartData.datasets[0].data[0];
  }

  get lastLineChartData(): number {
    if (this.lineChartData == null) return 0;
    return this.lineChartData.datasets[0].data[
      this.lineChartData.datasets[0].data.length - 1
    ];
  }

  loadLineChartData(): Promise<void> {
    this.loadedLineChartData = false;
    return this.fetchLineChartData().then(data => {
      this.lineChartData = data.data;
      this.loadedLineChartData = true;
      this.$store.dispatch(
        "setStyleState",
        this.firstLineChartData > this.lastLineChartData
          ? StyleState.RedAlert
          : StyleState.Default
      );
    });
  }

  updateDatasetsBorderColor() {
    if (this.lineChartData == null) return;

    this.lineChartData.datasets.forEach((d: any) => {
      switch (this.styleState) {
        case StyleState.RedAlert:
          d.borderColor = "#ff4f4f";
          break;
        default:
          d.borderColor = "#3fa9f5";
          break;
      }
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