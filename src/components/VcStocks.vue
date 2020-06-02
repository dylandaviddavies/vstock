<template>
  <div>
    <h1 class="vs-title">
      <span class="material-icons-round vs-title__icon" aria-hidden="true">multiline_chart</span>
      Stocks
    </h1>
    <div class="row">
      <div class="col-md-3">
        <div class="d-flex flex-column">
          <form @submit.prevent="applySearchFilter" class="vs-field">
            <label for="searchFilter" class="vs-field__label text-center">Search</label>
            <div class="vs-field__field">
              <button
                type="submit"
                class="material-icons-round vs-field__field__icon vs-field__field__icon--button"
                aria-hidden="true"
              >search</button>
              <input
                v-model="searchFilter"
                id="searchFilter"
                type="text"
                class="vs-field__field__input"
              />
              <button
                type="button"
                @click="clearSearchFilter"
                class="vs-field__field__icon vs-field__field__icon--button"
                :class="{'vs-field__field__icon--hide-right' : searchFilter === ''}"
              >
                <span class="material-icons-round" aria-hidden="true">close</span>
              </button>
            </div>
          </form>
          <div class="vs-field">
            <label for="changeFilter" class="vs-field__label text-center">Change</label>
            <div class="vs-field__field">
              <span class="material-icons-round vs-field__field__icon">show_chart</span>
              <select v-model="changeFilter" id="changeFilter" class="vs-field__field__select">
                <option value>Select</option>
                <option value="POSITIVE">Positive</option>
                <option value="NEGATIVE">Negative</option>
              </select>
              <span class="material-icons-round vs-field__field__icon">expand_more</span>
            </div>
          </div>
          <div>
            <label for="sort" class="vs-field__label d-block text-center">Sort</label>
            <div class="d-flex">
              <div class="vs-field mr-2" style="width:60%;">
                <div class="vs-field__field">
                  <span class="material-icons-round vs-field__field__icon">sort</span>
                  <select v-model="sort" id="sort" class="vs-field__field__select">
                    <option value="CHANGE">Change</option>
                    <option value="COMPANY_NAME">Company</option>
                    <option value="LATEST_PRICE">Latest Price</option>
                  </select>
                  <span class="material-icons-round vs-field__field__icon">expand_more</span>
                </div>
              </div>
              <div class="vs-field flex-grow-1">
                <div class="vs-field__field">
                  <select
                    v-model="sortDirection"
                    id="sortDirection"
                    class="vs-field__field__select"
                  >
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                  </select>
                  <span class="material-icons-round vs-field__field__icon">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div v-if="loadedStocks" class="row">
          <div class="col-6 col-xl-3 col-lg-4 mb-4" v-for="s in stocks" :key="s.symbol">
            <vs-stock-card class="h-100" :stock="s"></vs-stock-card>
          </div>
          <div class="col-6 col-xl-3 col-lg-4 mb-4">
            <button
              class="vs-add-card w-100 h-100"
              aria-controls="addStockModal"
              @click="openAddStockModal"
              :aria-expanded="isAddStockModalOpen"
              type="button"
            >
              <span aria-hidden="true" class="material-icons-round vs-add-card__icon">add</span>
              <span>Add stock</span>
            </button>
          </div>
        </div>
        <div v-else class="vs-loader"></div>
      </div>
    </div>
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
          <div class="vs-field vs-field--bordered">
            <label for class="vs-field__label text-center">Stock Symbol</label>
            <div class="vs-field__field">
              <span
                class="vs-field__field__icon material-icons-round"
                aria-hidden="true"
              >attach_money</span>
              <input
                v-model="stockSymbolToAdd"
                type="text"
                placeholder="e.g. AAPL"
                class="vs-field__field__input"
              />
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <button type="submit" class="vs-btn vs-btn--fill vs-btn--lg d-flex d-md-inline-flex">
              <span class="material-icons-round vs-btn__icon" aria-hidden="true">add</span>
              <span>Add stock</span>
            </button>
          </div>
        </form>
      </template>
    </vs-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VsStockCard from "./VsStockCard.vue";
import VsModal from "./VsModal.vue";
export default {
  watch: {
    changeFilter() {
      this.loadStocks();
    },
    sortDirection() {
      this.loadStocks();
    },
    sort() {
      this.loadStocks();
    }
  },

  computed: {
    ...mapState(["subscribedSymbols"])
  },

  components: {
    VsStockCard,
    VsModal
  },

  mounted() {
    this.loadStocks();
  },

  data() {
    return {
      loadedStocks: false,
      stocks: null,
      isAddStockModalOpen: false,
      stockSymbolToAdd: null,
      searchFilter: "",
      appliedSearchFilter: "",
      changeFilter: "",
      sort: "CHANGE",
      sortDirection: "DESC"
    };
  },

  methods: {
    applySearchFilter() {
      this.appliedSearchFilter = this.searchFilter;
      this.loadStocks();
    },

    clearSearchFilter() {
      this.searchFilter = "";
      this.appliedSearchFilter = "";
      this.loadStocks();
    },

    addStock() {
      this.$store.commit("SUBSCRIBE_STOCK_SYMBOL", this.stockSymbolToAdd);
      this.stockSymbolToAdd = null;
      this.loadStocks();
    },

    openAddStockModal() {
      this.isAddStockModalOpen = true;
      document.body.classList.add("overflow-hidden");
    },
    closeAddStockModal() {
      this.isAddStockModalOpen = false;
      document.body.classList.remove("overflow-hidden");
    },

    loadStocks() {
      this.loadedStocks = false;
      fetch(
        `${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/quotes?search=${
          this.appliedSearchFilter
        }&changeFilter=${this.changeFilter}&sort=${
          this.sort
        }&symbols=${this.subscribedSymbols.join(",")}`
      )
        .then(r => r.json())
        .then(data => {
          this.stocks = data;
          this.loadedStocks = true;
        });
    },

    tick(callback, time) {
      callback();
      setTimeout(() => this.tick(callback, time), time);
    }
  }
};
</script>

<style>
</style>