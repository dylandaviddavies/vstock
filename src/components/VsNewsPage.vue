<template>
  <div>
    <h1 class="vs-title">
      <span>My</span>
      &nbsp;
      <span>News</span>
    </h1>
    <div class="row">
      <div class="col-lg-8 col-12">
        <div v-if="loaded" class="vs-news-page">
          <vs-news-card :full="true" :news="n" v-for="n in news" :key="n.url"></vs-news-card>
        </div>
        <div v-else class="vs-loader"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import VsNewsCard from "./VsNewsCard.vue";
@Component({
  computed: mapState(["subscribedSymbols"]),
  components: {
    VsNewsCard
  }
})
export default class VsNewsPage extends Vue {
  private subscribedSymbols!: Array<string>;
  private news: Array<any> = [];
  private loaded: boolean = false;

  mounted() {
    this.load();
  }

  load(): Promise<void> {
    this.loaded = false;
    return this.fetch().then(data => {
      this.news = data;
      this.loaded = true;
    });
  }

  fetch(): Promise<any> {
    return fetch(`
      ${process.env.VUE_APP_VSTOCK_API_URL}/api/v1/news?limit=10&symbols=${this.subscribedSymbols}
    `).then(r => r.json());
  }
}
</script>

<style scoped>
</style>