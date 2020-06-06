<template>
  <component :is="tag" :to="to" class="vs-stock-card">
    <span class="vs-stock-card__head">
      <span class="vs-stock-card__symbol">{{stock.primaryExchange}}: {{stock.symbol}}</span>
      <span class="vs-stock-card__price">{{stock.latestPrice}}</span>
      <span class="vs-stock-card__change" :class="[changeClass]">
        <span class="d-flex align-items-center">
          <span class="d-flex flex-column mr-2">
            <span class="mb-2">{{stock.change > 0 ? '+' : ''}}{{stock.change}}</span>
            <span style="font-size:.7em;">({{stock.change > 0 ? '+' : ''}}{{changePercentage}})</span>
          </span>
        </span>
      </span>
    </span>
    <span class="vs-stock-card__body">
      <span class="vs-stock-card__title">{{stock.companyName}}</span>
    </span>
  </component>
</template>

<script>
export default {
  props: {
    stock: {
      type: Object,
      required: true
    },

    onClick: {
      type: Function
    },

    to: {
      required: false
    }
  },

  computed: {
    tag() {
      if (this.to) {
        return "router-link";
      }

      return "button";
    },

    changeClass() {
      if (this.stock.change > 0) return "vs-stock-card__change--good";
      if (this.stock.change < 0) return "vs-stock-card__change--bad";
      return "vs-stock-card__change--neutral";
    },

    changePercentage() {
      if (this.stock.latestPrice === 0) return "0%";
      return (
        Math.round((this.stock.change / this.stock.latestPrice) * 100) / 100 +
        "%"
      );
    }
  }
};
</script>

<style>
</style>