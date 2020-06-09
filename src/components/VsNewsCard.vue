<template>
  <div class="vs-news-card">
    <div class="vs-news-card__img" :style="`background-image:url(${news.image})`"></div>
    <div class="vs-news-card__body">
      <div class="vs-news-card__source">{{news.source}}</div>
      <a
        class="vs-news-card__title"
        :href="news.url"
        target="_blank"
        rel="noopener noreferrer"
      >{{news.headline}}</a>
      <p class="vs-news-card__summary">{{summary}}</p>
      <div class="d-flex flex-wrap">
        <div
          v-for="r in related"
          :key="r"
          class="vs-chip vs-chip--small vs-chip--active"
          type="button"
        >{{r}}</div>
      </div>
      <div class="vs-news-card__date">{{date}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";

@Component
export default class VsNews extends Vue {
  @Prop({ required: true })
  private readonly news!: any;

  @Prop({ required: false, default: false })
  private readonly full!: boolean;

  get related() {
    return this.news.related.split(",");
  }

  get summary() {
    return this.news.summary.length > 150
      ? this.news.summary.substr(0, 150) + "..."
      : this.news.summary;
  }

  get date() {
    return moment(this.news.datetime).format("MMM DD, YYYY");
  }
}
</script>

<style scoped>
</style>