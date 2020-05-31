<template>
  <div class="vs-stock-card">
    <div class="vs-stock-card__head">
      <div class="vs-stock-card__symbol">{{stock.primaryExchange}}: {{stock.symbol}}</div>
      <div class="vs-stock-card__price">${{stock.latestPrice}} USD</div>
      <div class="vs-stock-card__change" :class="[changeClass]">
        <template v-if="stock.change > 0">+</template>{{stock.change}}
        <span class="material-icons-round" aria-hidden="true">
          <template v-if="stock.change < 0">arrow_downward</template>
          <template v-else-if="stock.change > 0">arrow_upward</template>
          <template v-else>unfold_more</template>
        </span>
      </div>
    </div>
    <div class="vs-stock-card__body">
      <div class="vs-stock-card__title">{{stock.companyName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stock: {
      type: Object,
      required: true
    }
  },

  computed: {
    changeClass() {
      if (this.stock.change > 0) return "vs-stock-card__change--good";
      if (this.stock.change < 0) return "vs-stock-card__change--bad";
      return "vs-stock-card__change--neutral";
    }
  }
};
</script>

<style>
</style>