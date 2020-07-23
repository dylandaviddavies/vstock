<template>
  <a class="vs-news-hero" :href="news.url" target="_blank" rel="noopener noreferrer">
    <span
      class="vs-news-hero__img"
      :style="`background-image:url(${news.image})`"
      aria-hidden="true"
    ></span>
    <span class="vs-news-hero__info">
      <span class="vs-news-hero__source">{{news.source}}</span>
      <span class="vs-news-hero__title">{{headline}}</span>
      <span class="vs-news-hero__p">{{summary}}</span>
    </span>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsNewsHero extends Vue {
  @Prop({ required: true })
  private readonly news!: any;

  get summary() {
    return this.news.summary.length > 100
      ? this.news.summary.substr(0, 100) + "..."
      : this.news.summary;
  }
  get headline() {
    return this.news.headline.length > 100
      ? this.news.headline.substr(0, 100) + "..."
      : this.news.headline;
  }
}
</script>

<style scoped>
</style>