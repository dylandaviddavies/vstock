<template>
  <div>
    <vs-toasts :toasts="toasts"></vs-toasts>
    <div v-if="loaded">
      <div class="d-flex justify-content-between">
        <div>
          <h1 class="vs-title">{{stock.quote.companyName}}</h1>
          <h2 class="vs-subtitle">{{stock.quote.symbol}}</h2>
        </div>
        <div>
          <vs-btn-group>
            <vs-btn-group-action :onClick="openRemoveModal" aria-controls="removeModal">Remove</vs-btn-group-action>
          </vs-btn-group>
          <vs-modal
            :isOpen="isRemoveModalOpen"
            :headAsColumn="true"
            :onClose="closeRemoveModal"
            :img="require('../assets/add_stock_img.svg')"
            id="removeModal"
          >
            <template v-slot:title>Remove stock</template>
            <template v-slot:body>
              <p
                class="my-4 text-center text-grey"
              >Are you sure you want to remove this stock from your portfolio?</p>
              <div class="row justify-content-center">
                <div class="col-12 mb-4 col-sm-4">
                  <button
                    @click="remove"
                    class="w-100 vs-btn vs-btn--lg vs-btn--danger vs-btn--fill"
                  >Yes, I'm sure</button>
                </div>
                <div class="col-12 mb-4 col-sm-4">
                  <button
                    @click="closeRemoveModal"
                    class="w-100 vs-btn vs-btn--default vs-btn--lg vs-btn--danger vs-btn--fill"
                  >No, I'm not</button>
                </div>
              </div>
            </template>
          </vs-modal>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-2 mb-4 col-sm-4">
          <div class="vs-box text-center">
            <div class="vs-box__title">
              <span>My</span>&nbsp;
              <span>Price</span>
            </div>
            <div class="text-center">
              <div class="vs-stock-card__price">{{stock.quote.latestPrice}}</div>
              <span
                class="vs-stock-card__change"
                :class="{'vs-stock-card__change--good': stock.quote.change > 0, 'vs-stock-card__change--bad': stock.quote.change < 0}"
              >
                <div class="mb-2">{{stock.quote.change > 0 ? '+' : ''}}{{stock.quote.change}}</div>
                <div style="font-size: 0.7em;">({{changePercentage}})</div>
              </span>
            </div>
          </div>
        </div>
        <div class="col-lg-7 mb-4 col-sm-4">
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
        <div class="col-lg-3 col-sm-4">
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
import VsToasts from "./VsToasts.vue";
import VsLineChart from "./VsLineChart.vue";
import VsNews from "./VsNews.vue";
import VsModal from "./VsModal.vue";
import VsBtnGroup from "./VsBtnGroup.vue";
import VsBtnGroupAction from "./VsBtnGroupAction.vue";
import chartRangeXaxesOptions from "../scripts/chartRangeXaxesOptions";

@Component({
  components: {
    VsLineChart,
    VsModal,
    VsNews,
    VsBtnGroup,
    VsBtnGroupAction,
    VsToasts
  }
})
export default class VsStockOverview extends Vue {
  private toasts: Array<string> = [];
  private isRemoveModalOpen: boolean = false;
  private loadedNews: boolean = false;
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

  remove() {
    this.closeRemoveModal();
    this.$store.dispatch("unsubscribeStock", this.stock.quote.symbol);
    this.toasts.push(`Removed stock`);
  }

  openRemoveModal() {
    this.isRemoveModalOpen = true;
  }

  closeRemoveModal() {
    this.isRemoveModalOpen = false;
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