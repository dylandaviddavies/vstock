<template>
  <tr class="vs-stock-row">
    <td v-if="number">
      <span class="vs-stock-row__number">{{number}}.</span>
    </td>
    <td>
      <span
        class="vs-stock-row__change"
      >{{ stock.change > 0 ? '+' : '' }}{{stock.change}} ({{changePercentage}})</span>
    </td>
    <td class="vs-stock-row__price">{{stock.latestPrice}}</td>
    <td class="vs-stock-row__content">
      <span class="vs-stock-row__title">{{stock.companyName}}</span>
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