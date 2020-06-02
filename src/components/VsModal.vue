<template>
  <div
    :id="modalId"
    :aria-labelledby="modalTitleId"
    :aria-hidden="!isOpen"
    role="dialog"
    @keydown.esc="close"
    aria-modal="true"
    class="vs-modal"
    :class="{'vs-modal--open' : isOpen}"
  >
    <div class="vs-modal__inner" v-click-outside="onClickOutside">
      <button @click="close" class="vs-modal__close">
        <span aria-hidden="true" class="vs-modal__close__icon material-icons-round">close</span>
      </button>
      <div class="vs-modal__head" :class="{'flex-column align-items-center' : headAsColumn}">
        <img :src="img" class="vs-modal__img" v-if="img" />
        <h3 :id="modalTitleId" class="vs-modal__title">
          <slot name="title"></slot>
        </h3>
      </div>
      <div class="vs-modal__body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
export default {
  computed: {
    modalTitleId() {
      return `vsModalTitle-${this.modalId}`;
    }
  },

  props: {
    id: {
      type: String
    },
    isOpen: {
      type: Boolean
    },
    onClose: {
      type: Function
    },
    headAsColumn: {
      type: Boolean
    },
    img: {
      type: String
    }
  },

  data() {
    return {
      modalId: this.id || this._uid
    };
  },

  methods: {
    close() {
      this.onClose();
    },

    onClickOutside(event) {
      if (event.target.getAttribute("aria-controls") === this.modalId) return;
      this.close();
    }
  },

  directives: {
    ClickOutside
  }
};
</script>

<style>
</style>