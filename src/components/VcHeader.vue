<template>
  <header class="vs-header">
    <div class="vs-header__inner">
      <router-link class="vs-header__logo mr-5" to="/"><img class="vs-header__logo__img" src="../assets/logo.svg" alt="vstock" /></router-link>
      <ul class="d-none d-sm-flex vs-header__links">
        <li>
          <router-link class="vs-header__link" active-class="vs-header__link--active" to="/dashboard">Dashboard</router-link>
        </li>
        <li>
          <router-link class="vs-header__link" active-class="vs-header__link--active" to="/discussions">Insights</router-link>
        </li>
      </ul>
      <router-link to="/stocks" tag="button" class="ml-auto vs-btn vs-btn--fill">
        <span class="material-icons-round vs-btn__icon" aria-hidden="true">show_chart</span>
        My Stocks
      </router-link>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style>
</style>