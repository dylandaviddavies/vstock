<template>
  <div>
    <h1 class="vs-title">Trending</h1>
    <div class="row">
      <div class="col-12 col-md-9 col-xl-6">
        <div class="vs-section mb-4">
          <h2 class="vs-section__title">
            <span>Today's</span>
            &nbsp;
            <span>Trending</span>
          </h2>
          <div class="vs-section__body pb-3">
            <p class="text-grey">Stocks other users are keeping an eye on.</p>
          </div>
          <div class="vs-section__body overflow-auto">
            <div class="vs-loader" v-if="!loadedTodaysTrendingStocks"></div>
            <table v-else-if="todaysTrendingStocks.length > 0">
              <tbody>
                <vs-stock-row
                  :stock="q"
                  :number="i + 1"
                  v-for="(q, i) in todaysTrendingStocks"
                  :key="q.symbol"
                ></vs-stock-row>
              </tbody>
            </table>
            <div v-else>
              <img
                class="w-50 mt-4 mb-3 mx-auto"
                :src="require('../assets/no_trending_stocks.svg')"
                alt="No gains recorded"
              />
              <div class="text-center text-grey">No trending stocks found</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VsStockRow from "../components/VsStockRow.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    VsStockRow
  }
})
export default class VsTrending extends Vue {
  private loadedTodaysTrendingStocks: boolean = false;
  private todaysTrendingStocks: Array<any> = [];

  mounted() {
    this.loadTodaysTrendingStocks();
  }

  loadTodaysTrendingStocks(): Promise<void> {
    this.loadedTodaysTrendingStocks = false;
    return this.fetchTodaysTrendingStocks().then(data => {
      this.todaysTrendingStocks = data;
      this.loadedTodaysTrendingStocks = true;
    });
  }

  fetchTodaysTrendingStocks(): Promise<any> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/trendingQuotes
    `).then(r => r.json());
  }
}
</script>

<style scoped>
</style>