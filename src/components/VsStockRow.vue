<template>
  <tr
    class="vs-stock-row"
    :class="{'vs-stock-row--good': stock.change > 0, 'vs-stock-row--bad': stock.change < 0}"
  >
    <td v-if="number">
      <span class="vs-stock-row__number">{{number}}.</span>
    </td>
    <td>
      <span
        class="vs-stock-row__change"
      >{{ stock.change > 0 ? '+' : '' }}{{stock.change}} ({{changePercentage}})</span>
    </td>
    <td class="vs-stock-row__price">${{stock.latestPrice}}</td>
    <td class="vs-stock-row__content">
      <router-link
        :to="`/stock/${ stock.symbol }`"
        class="vs-stock-row__title"
      >{{stock.companyName}}</router-link>
      <span class="vs-stock-row__subtitle">{{stock.symbol}}</span>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsStockRow extends Vue {
  @Prop({ required: true })
  private readonly stock!: any;
  @Prop()
  private readonly number!: number;

  get changePercentage(): string {
    if (this.stock.latestPrice === 0) return "0%";
    return (
      Math.round((this.stock.change / this.stock.latestPrice) * 100) / 100 + "%"
    );
  }
}
</script>

<style scoped>
</style>