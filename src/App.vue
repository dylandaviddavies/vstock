<template>
  <div class="vs-app">
    <div class="vs-toast" :class="{'vs-toast--inflated': isToastInflated}">
      <div class="vs-toast__inner">
        <span class="vs-toast__icon material-icons-round">done</span>
        <span class="vs-toast__content">{{currentToast}}</span>
        <button @click="isToastInflated=false" class="vs-toast__close">
          <span class="material-icons-round vs-toast__close__icon" aria-hidden="true">close</span>
        </button>
      </div>
    </div>
    <div
      v-click-outside="onClickOutsideSidebar"
      class="vs-sidebar"
      :class="{'vs-sidebar--visible' : isSidebarVisible}"
    >
      <button
        class="vs-sidebar__toggle"
        @click="isSidebarVisible = !isSidebarVisible"
        aria-controls="vsSidebar"
      >
        <span class="material-icons-round" aria-hidden="true">menu</span>
      </button>
      <aside id="vsSidebar" :aria-hidden="!isSidebarVisible" class="vs-sidebar__inner">
        <router-link @click.native="closeSidebar" class="vs-sidebar__logo" to="/">
          <img class="vs-sidebar__logo__img" src="./assets/logo.svg" alt="vstock" />
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
              @click.native="closeSidebar"
              active-class="vs-sidebar__link--active"
              to="/dashboard"
            >
              <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">pie_chart</span> Overview
            </router-link>
          </li>
          <li>
            <router-link
              class="vs-sidebar__link"
              @click.native="closeSidebar"
              active-class="vs-sidebar__link--active"
              to="/insights"
            >
              <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">bar_chart</span> Insights
            </router-link>
          </li>
          <li>
            <router-link
              class="vs-sidebar__link"
              @click.native="closeSidebar"
              active-class="vs-sidebar__link--active"
              to="/trade"
            >
              <span
                class="material-icons-round vs-sidebar__link__icon"
                aria-hidden="true"
              >storefront</span> Buy & Sell
            </router-link>
          </li>
          <li>
            <router-link
              class="vs-sidebar__link"
              @click.native="closeSidebar"
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
              @click.native="closeSidebar"
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
              @click.native="closeSidebar"
              active-class="vs-sidebar__link--active"
              to="/settings"
            >
              <span class="material-icons-round vs-sidebar__link__icon" aria-hidden="true">settings</span> Settings
            </router-link>
          </li>
        </ul>
      </aside>
    </div>
    <vs-header :onMenuClick="onMenuClick"></vs-header>
    <main class="vs-main">
      <router-view></router-view>
    </main>
    <footer class="vs-footer"></footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import VsHeader from "./components/VsHeader.vue";

@Component({
  components: {
    VsHeader
  },
  computed: mapState(["toasts"])
})
export default class App extends Vue {
  private toasts!: Array<string>;
  private search: string = "";
  private isToastInflated: boolean = false;
  private currentToast: string | null = null;
  private isSidebarVisible: boolean = false;

  @Watch("toasts")
  watchToasts() {
    this.popToast();
  }

  @Watch("isSidebarVisible")
  watchIsSidebarVisible(newVal: string) {
    if (newVal) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }

  closeSidebar() {
    this.isSidebarVisible = false;
  }

  onClickOutsideSidebar() {
    this.closeSidebar();
  }

  onMenuClick() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  doSearch(): void {
    this.$router.push("/stock/" + this.search);
    this.closeSidebar();
  }

  popToast() {
    if (this.isToastInflated) return;

    this.$store.dispatch("popToast").then(t => {
      if (t == null) return;

      this.currentToast = t;

      this.isToastInflated = true;

      setTimeout(() => {
        this.isToastInflated = false;

        setTimeout(() => {
          this.currentToast = null;

          this.popToast();
        }, 1000);
      }, 4000);
    });
  }
}
</script>

<style scoped>
</style>