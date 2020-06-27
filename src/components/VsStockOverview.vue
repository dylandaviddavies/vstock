<template>
  <div>
    <div v-if="loaded">
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
                <div class="col-12 mb-4 col-sm-4">
                  <button
                    @click="unsubscribe"
                    class="w-100 vs-btn vs-btn--lg vs-btn--danger vs-btn--fill"
                  >Yes, I'm sure</button>
                </div>
                <div class="col-12 mb-4 col-sm-4">
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
      <div class="row">
        <div class="row col-xl-9">
          <div class="col-12">
            <div class="vs-box mb-4">
              <div class="vs-box__title">Stats</div>
              <div class="vs-box__body">
                <div class="row">
                  <div class="col-3">
                    <div class="vs-stock-stat">
                      <div class="vs-stock-stat__title fw-zebra">
                        <span>Current</span>&nbsp;
                        <span>Price</span>
                      </div>
                      <div class="vs-stock-stat__value">{{stock.quote.latestPrice}}</div>
                      <span
                        class="vs-stock-stat__change"
                        :class="{'vs-stock-stat___change--good': stock.quote.change > 0, 'vs-stock-stat___change--bad': stock.quote.change < 0}"
                      >
                        <div
                          class="mb-2"
                        >{{stock.quote.change > 0 ? '+' : ''}}{{stock.quote.change}}</div>
                        <div style="font-size: 0.7em;">({{changePercentage}})</div>
                      </span>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="vs-stock-stat">
                      <div class="vs-stock-stat__title fw-zebra">
                        <span>Buy</span>&nbsp;
                        <span>Price</span>
                      </div>
                      <div class="vs-stock-stat__value">{{buyPrice}}</div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="vs-stock-stat">
                      <div class="vs-stock-stat__title">
                        <span>Profit</span>
                      </div>
                      <div class="vs-stock-stat__value">{{stock.quote.latestPrice}}</div>
                      <span
                        class="vs-stock-stat__change"
                        :class="{'vs-stock-stat___change--good': stock.quote.change > 0, 'vs-stock-stat___change--bad': stock.quote.change < 0}"
                      >
                        <div
                          class="mb-2"
                        >{{stock.quote.change > 0 ? '+' : ''}}{{stock.quote.change}}</div>
                        <div style="font-size: 0.7em;">({{changePercentage}})</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="vs-box mb-4">
              <div class="vs-box__title">Timeline</div>
              <div class="vs-box__body">
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
          </div>
        </div>
        <div class="col-xl-3">
          <div class="vs-box vs-box--small mb-4">
            <div class="vs-box__title">News</div>
            <div>
              <div class="vs-box__body vs-loader" v-if="!loadedNews"></div>
              <div style="max-height:500px;" class="overflow-auto" v-else-if="news.length > 0">
                <vs-news v-for="n in news" :news="n" :key="n.url"></vs-news>
              </div>
              <div class="vs-box__body" v-else>
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
    }
    this.loadLineChartData();
  }

  get isSubscribed(): boolean {
    return this.subbedStocks
      .map(s => s.symbol)
      .includes(this.stock.quote.symbol);
  }

  get changePercentage() {
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

  fetchStock(): Promise<any> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/stock/${this.$route.params.symbol}`
    ).then(r => r.json());
  }
}
</script>

<style scoped>
</style>