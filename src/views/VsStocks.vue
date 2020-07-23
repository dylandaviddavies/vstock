<template>
  <div>
    <h1 class="vs-title">
      <span>My</span>
      &nbsp;
      <span>Stocks</span>
    </h1>
    <div class="row">
      <div class="col-xl-3">
        <vs-stock-filters :onFilter="applyFilters"></vs-stock-filters>
      </div>
      <div class="col-xl-9">
        <p class="text-center mb-3">{{ subbedStocks.length }} / {{ maxSymbols }} stocks</p>
        <div v-if="loadedStocks || silentlyLoadStocks" class="row">
          <div class="col-6 col-xl-3 col-lg-4 p-2" v-for="s in stocks" :key="s.symbol">
            <vs-stock-card :to="`/stock/${s.symbol}`" class="h-100" :stock="s"></vs-stock-card>
          </div>
          <div class="col-6 col-xl-3 col-lg-4 mb-5">
            <vs-modal
              :isOpen="isAddStockModalOpen"
              :headAsColumn="true"
              :onClose="closeAddStockModal"
              :img="require('../assets/add_stock_img.svg')"
              id="addStockModal"
            >
              <template v-slot:title>Add stock</template>
              <template v-slot:body>
                <p class="my-4 text-center text-grey">Add the symbol of a stock you'd like to watch.</p>
                <form @submit.prevent="addStock">
                  <div
                    class="vs-field mb-4"
                    :class="{'vs-field--error' : isStockSymbolToAddInvalid}"
                  >
                    <label for class="vs-field__label text-center">Stock Symbol</label>
                    <div class="vs-field__field">
                      <span
                        class="vs-field__field__icon vs-field__field__icon--start material-icons-round"
                        aria-hidden="true"
                      >attach_money</span>
                      <input
                        ref="stockSymbolToAdd"
                        v-model="stockSymbolToAdd"
                        type="text"
                        required
                        placeholder="e.g. AAPL"
                        class="vs-field__field__input"
                      />
                    </div>
                    <vs-alert v-if="isStockSymbolToAddInvalid" type="error" class="my-3">
                      <strong>
                        <i>{{invalidStockSymbolToAdd}}</i>
                      </strong>&nbsp;
                      <span>doesn't appear to be a valid stock option. Please try again or try a different stock symbol.</span>
                    </vs-alert>
                  </div>
                  <div class="d-flex justify-content-center">
                    <button
                      type="submit"
                      class="vs-btn vs-btn--fill vs-btn--lg d-flex d-md-inline-flex"
                    >
                      <span class="material-icons-round vs-btn__icon" aria-hidden="true">add</span>
                      <span>Add stock</span>
                    </button>
                  </div>
                </form>
              </template>
            </vs-modal>
          </div>
        </div>
        <div v-else class="vs-loader"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { Stock } from "../types";
import { Component, Vue, Watch, Ref } from "vue-property-decorator";
import { mapState } from "vuex";
import VsStockCard from "../components/VsStockCard.vue";
import VsModal from "../components/VsModal.vue";
import VsAlert from "../components/VsAlert.vue";
import VsStockFilters from "../components/VsStockFilters.vue";

@Component({
  components: {
    VsStockCard,
    VsModal,
    VsAlert,
    VsStockFilters
  },
  computed: mapState(["subbedStocks", "maxSymbols"])
})
export default class VsStocks extends Vue {
  private subbedStocks!: Array<any>;
  private loadedStocks: boolean = false;
  private isStockSymbolToAddInvalid: boolean = false;
  private invalidStockSymbolToAdd: string = "";
  private silentlyLoadStocks: boolean = false;
  private stocks: Array<any> = [];
  private isAddStockModalOpen: boolean = false;
  private stockSymbolToAdd: string = "";
  private filters: Record<string, string> = {};

  @Ref("stockSymbolToAdd")
  private readonly txtStockSymbolToAdd!: HTMLInputElement;

  @Watch("filters", { immediate: true, deep: true })
  watchFilters() {
    this.loadStocks();
  }

  @Watch("isAddStockModalOpen")
  watchIsAddStockModalOpen(newVal: boolean) {
    if (newVal) this.txtStockSymbolToAdd.focus();
  }

  mounted() {
    this.loadStocks();
  }

  applyFilters(filters: Record<string, string>) {
    this.filters = filters;
  }

  setInvalidStockSymbolToAdd(stockSymbol: string) {
    this.invalidStockSymbolToAdd = stockSymbol;
    this.isStockSymbolToAddInvalid = true;
  }

  async addStock(): Promise<boolean> {
    return await this.verifyStockSymbol(this.stockSymbolToAdd)
      .then(valid => {
        if (!valid) {
          this.setInvalidStockSymbolToAdd(this.stockSymbolToAdd);
          return false;
        }
        this.$store.dispatch("subscribeStock", {
          symbol: this.stockSymbolToAdd
        } as Stock);
        this.closeAddStockModal();
        this.$store.dispatch("addToast", "Added stock.");
        this.loadStocks();
        return true;
      })
      .catch(() => {
        this.setInvalidStockSymbolToAdd(this.stockSymbolToAdd);
        return false;
      });
  }

  openAddStockModal() {
    this.isAddStockModalOpen = true;
    document.body.classList.add("overflow-hidden");
  }

  closeAddStockModal() {
    this.isAddStockModalOpen = false;
    document.body.classList.remove("overflow-hidden");
    this.invalidStockSymbolToAdd = "";
    this.stockSymbolToAdd = "";
    this.isStockSymbolToAddInvalid = false;
  }

  verifyStockSymbol(stockSymbol: string): Promise<boolean> {
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/quotes?symbols=${stockSymbol}`
    )
      .then(r => r.json())
      .then(data => data.length > 0);
  }

  loadStocks() {
    this.loadedStocks = false;
    let options = {
      symbols: this.subbedStocks.map(s => s.symbol).join(","),
      ...this.filters
    };
    this.fetchStocks(options).then(data => {
      this.stocks = data;
      this.loadedStocks = true;
    });
  }

  fetchStocks(options: Record<string, string>): Promise<Array<Object>> {
    let params = new URLSearchParams(options).toString();
    return fetch(
      `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/quotes?${params}`
    ).then(r => r.json());
  }
}
</script>

<style>
</style>