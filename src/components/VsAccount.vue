<template>
  <div class="vs-account">
    <div class="vs-account__head">
      <img v-if="user.img != null" class="vs-account__head__img" :src="user.img" />
      <span v-else class="vs-account__head__img material-icons-round" aria-hidden="true">person</span>
      <h2 class="vs-account__username">{{user.name}}</h2>
    </div>
    <div class="vs-account__content">
      <div class="vs-account__section mb-5">
        <h3 class="vs-account__section__title">Account</h3>
        <p class="mb-3 text-grey">Details about your account.</p>
        <form action>
          <div class="vs-field mb-4">
            <label for class="vs-field__label">Username</label>
            <div class="vs-field__field">
              <span
                aria-hidden="true"
                class="vs-field__field__icon vs-field__field__icon--start material-icons-round"
              >person</span>
              <input
                type="text"
                required="required"
                v-model="editUsername"
                class="vs-field__field__input"
              />
            </div>
          </div>
          <div class="vs-field mb-4">
            <label for class="vs-field__label">Image</label>
            <div>
              <label class="vs-btn vs-btn--default pr-4 vs-btn--fill">
                <input type="file" class="d-none" />
                <span class="material-icons-round mr-1" aria-hidden="true">upload</span>
                <span>Upload</span>
              </label>
            </div>
          </div>
          <button class="vs-btn vs-btn--lg vs-btn--fill vs-btn--primary">Save</button>
        </form>
      </div>
      <div class="vs-account__section">
        <h3 class="vs-account__section__title">My Data</h3>
        <p
          class="mb-3 text-grey"
        >Your data includes information such as your stocks and your account details.</p>
        <button class="vs-btn vs-btn--lg vs-btn--danger vs-btn--fill">Delete My Data</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { User } from "../types";
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
@Component({
  computed: mapState(["user"])
})
export default class VsAccount extends Vue {
  private user!: User;
  private editUsername?: string;

  mounted() {
    this.editUsername = this.user.name;
  }
}
</script>

<style scoped>
</style>