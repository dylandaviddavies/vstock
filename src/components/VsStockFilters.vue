<template>
  <div class="d-flex flex-column">
    <form @submit.prevent="applySearchFilter" class="vs-field mb-4">
      <label for="searchFilter" class="vs-field__label text-center">Search</label>
      <div class="vs-field__field">
        <button
          type="submit"
          class="material-icons-round vs-field__field__icon vs-field__field__icon--button vs-field__field__icon--start"
          aria-hidden="true"
        >search</button>
        <button
          type="button"
          @click="clearSearchFilter"
          class="vs-field__field__icon vs-field__field__icon--button vs-field__field__icon--end"
          :class="{'vs-field__field__icon--hide-right' : searchFilter === ''}"
        >
          <span class="material-icons-round" aria-hidden="true">close</span>
        </button>
        <input
          v-model="searchFilter"
          id="searchFilter"
          required
          type="text"
          class="vs-field__field__input"
        />
      </div>
    </form>
    <div class="vs-field mb-4">
      <label for="changeFilter" class="vs-field__label text-center">Change</label>
      <div class="vs-field__field">
        <span
          class="material-icons-round vs-field__field__icon vs-field__field__icon--start"
        >show_chart</span>
        <span
          class="material-icons-round vs-field__field__icon vs-field__field__icon--end"
        >expand_more</span>
        <select v-model="changeFilter" id="changeFilter" class="vs-field__field__select">
          <option value>Select</option>
          <option value="POSITIVE">Positive</option>
          <option value="NEGATIVE">Negative</option>
        </select>
      </div>
    </div>
    <div>
      <div class="vs-field">
        <label for="sort" class="vs-field__label d-block text-center">Sort</label>
      </div>
      <div class="d-flex">
        <div class="vs-field mb-4 mr-2" style="width:60%;">
          <div class="vs-field__field">
            <span
              class="material-icons-round vs-field__field__icon vs-field__field__icon--start"
            >sort</span>
            <span
              class="material-icons-round vs-field__field__icon vs-field__field__icon--end"
            >expand_more</span>
            <select v-model="sort" id="sort" class="vs-field__field__select">
              <option value="CHANGE">Change</option>
              <option value="COMPANY_NAME">Company</option>
              <option value="LATEST_PRICE">Latest Price</option>
            </select>
          </div>
        </div>
        <div class="vs-field mb-4 flex-grow-1">
          <div class="vs-field__field">
            <span
              class="material-icons-round vs-field__field__icon vs-field__field__icon--end"
            >expand_more</span>
            <select v-model="sortDirection" id="sortDirection" class="vs-field__field__select">
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";

@Component
export default class VsStockFilters extends Vue {
  private searchFilter: string = "";
  private appliedSearchFilter: string = "";
  private changeFilter: string = "";
  private sort: string = "CHANGE";
  private sortDirection: string = "DESC";

  @Prop({ required: true })
  private readonly onFilter!: Function;

  @Watch("changeFilter")
  watchChangeFilter() {
    this.apply();
  }

  @Watch("sortDirection")
  watchSortDirection() {
    this.apply();
  }

  @Watch("sort")
  watchSort() {
    this.apply();
  }

  applySearchFilter() {
    this.appliedSearchFilter = this.searchFilter;
    this.apply();
  }

  clearSearchFilter() {
    this.searchFilter = "";
    this.appliedSearchFilter = "";
    this.apply();
  }

  apply() {
    this.onFilter({
      search: this.appliedSearchFilter,
      sort: this.sort,
      sortDirection: this.sortDirection,
      changeFilter: this.changeFilter
    });
  }
}
</script>

<style>
</style>