<template>
  <div class="vs-news">
    <div class="vs-news__source">{{news.source}}</div>
    <a
      class="vs-news__title"
      :href="news.url"
      target="_blank"
      rel="noopener noreferrer"
    >{{news.headline}}</a>
    <p class="vs-news__summary">{{summary}}</p>
    <div class="d-flex flex-wrap">
      <router-link
        :to="`/stock/${r}`"
        v-for="r in related"
        :key="r"
        class="vs-chip mr-2 mb-2 vs-chip--small vs-chip--primary"
      >{{r}}</router-link>
    </div>
    <div class="vs-news__date">{{date}}</div>
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