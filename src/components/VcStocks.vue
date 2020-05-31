<template>
  <div>
    <div v-if="loadedStocks">
      <div class="row">
        <div class="col-md-3">
          <div class="d-flex flex-column">
            <div class="vs-stock-filter">
              <label for="searchFilter" class="vs-stock-filter__label">Search</label>
              <div class="vs-stock-filter__field">
                <span class="material-icons-round vs-stock-filter__field__icon">search</span>
                <input id="searchFilter" type="text" class="vs-stock-filter__field__input" />
              </div>
            </div>
            <div class="vs-stock-filter">
              <label for="search" class="vs-stock-filter__label">Change</label>
              <div class="vs-stock-filter__field">
                <span class="material-icons-round vs-stock-filter__field__icon">show_chart</span>
                <select id="changeFilter" class="vs-stock-filter__field__select">
                  <option value>Select</option>
                  <option value="POSITIVE">Positive</option>
                  <option value="NEGATIVE">Negative</option>
                </select>
                <span class="material-icons-round vs-stock-filter__field__icon">expand_more</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div class="col-6 col-xl-3 col-lg-4 mb-4" v-for="s in stocks" :key="s.symbol">
              <vs-stock-card class="h-100" :stock="s"></vs-stock-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="vs-loader"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import VsStockCard from "./VsStockCard.vue";
export default {
  computed: {
    ...mapState([
      'subscribedSymbols'
    ])
  },

  components: {
    VsStockCard
  },

  mounted() {
    this.loadStocks();
  },

  data() {
    return {
      loadedStocks: false,
      stocks: null
    };
  },

  methods: {
    loadStocks() {
      this.loadedStocks = false;
      fetch(
        `https://vstock-api.herokuapp.com/api/v1/quotes?symbols=${this.subscribedSymbols.join(",")}`
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