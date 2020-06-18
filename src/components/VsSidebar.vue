<template>
  <div
    v-click-outside="onClickOutside"
    class="vs-sidebar"
    :class="{'vs-sidebar--visible' : visible}"
  >
    <button class="vs-sidebar__toggle" @click="toggleVisible" aria-controls="vsSidebar">
      <span class="material-icons-round" aria-hidden="true">menu</span>
    </button>
    <aside id="vsSidebar" :aria-hidden="!visible" class="vs-sidebar__inner">
      <router-link @click.native="close" class="vs-sidebar__logo" to="/">
        <img class="vs-sidebar__logo__img" src="../assets/logo.svg" alt="vstock" />
      </router-link>
      <form class="vs-sidebar__search" @submit.prevent="doSearch">
        <span class="material-icons-round vs-sidebar__search__icon" aria-hidden="true">search</span>
        <input
          type="text"
          v-model="search"
          class="vs-sidebar__search__input"
          placeholder="Enter stock..."
        />
      </form>
      <ul class="vs-sidebar__links">
        <li>
          <router-link
            class="vs-sidebar__link"
            @click.native="close"
            active-class="vs-sidebar__link--active"
            to="/dashboard"
          >
            <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">pie_chart</span> Overview
          </router-link>
        </li>
        <li>
          <router-link
            class="vs-sidebar__link"
            @click.native="close"
            active-class="vs-sidebar__link--active"
            to="/news"
          >
            <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">menu_book</span>
            News
          </router-link>
        </li>
        <li>
          <router-link
            class="vs-sidebar__link"
            @click.native="close"
            active-class="vs-sidebar__link--active"
            to="/trending"
          >
            <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">trending_up</span>
            Trending
          </router-link>
        </li>
        <li>
          <router-link
            class="vs-sidebar__link"
            @click.native="close"
            active-class="vs-sidebar__link--active"
            to="/stocks"
          >
            <span
              class="material-icons-round vs-sidebar__link__icon"
              aria-hidden="true"
            >attach_money</span>
            My Stocks
          </router-link>
        </li>
      </ul>
      <ul class="mt-auto mb-5 vs-sidebar__links">
        <li>
          <router-link
            class="vs-sidebar__link"
            @click.native="close"
            active-class="vs-sidebar__link--active"
            to="/settings"
          >
            <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">settings</span> Settings
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsSidebar extends Vue {
  @Prop({ required: true })
  private visible!: boolean;

  @Prop({ required: true })
  private onVisibleChange!: Function;

  private search: string = "";

  close() {
    this.onVisibleChange(false);
  }

  @Watch("visible")
  watchVisible(newVal: boolean) {
    if (newVal) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }

  onClickOutside() {
    this.close();
  }

  toggleVisible() {
    this.onVisibleChange(!this.visible);
  }

  doSearch(): void {
    this.$router.push("/stock/" + this.search);
    this.close();
  }
}
</script>

<style scoped>
</style>