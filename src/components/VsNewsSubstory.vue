<template>
  <a class="vs-news-substory" :href="news.url" target="_blank" rel="noopener noreferrer">
    <span
      class="vs-news-substory__img"
      :style="`background-image:url(${news.image})`"
      aria-hidden="true"
    ></span>
    <span class="vs-news-substory__title">{{headline}}</span>
    <span class="vs-news-substory__source">{{news.source}}</span>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsNewsSubstory extends Vue {
  @Prop({ required: true })
  private readonly news!: any;

  get headline() {
    return this.news.headline.length > 50
      ? this.news.headline.substr(0, 50) + "..."
      : this.news.headline;
  }
}
</script>

<style scoped>
</style>