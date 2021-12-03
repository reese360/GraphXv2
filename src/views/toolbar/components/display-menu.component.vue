<template>
  <div class="tb-menu-wrapper">
    <button
      class="flex-center tb-btn menu-trigger-btn"
      @click.stop="toggleMenu()"
      :class="{ 'open-menu': showMenu }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="10" cy="10" r="7"></circle>
        <line x1="7" y1="10" x2="13" y2="10"></line>
        <line x1="10" y1="7" x2="10" y2="13"></line>
        <line x1="21" y1="21" x2="15" y2="15"></line>
      </svg>
      <!-- <span>{{ currentZoom }}%</span> -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="chev-down"
        :class="{ open: showMenu }"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <onClickOutside
      @trigger="toggleMenu()"
      v-if="showMenu"
      class="tb-menu"
      id="display-options"
    >
      <ul class="tb-list">
        <li v-for="(action, idx) in zoomActions" :key="idx">
          <button>{{ action }}</button>
        </li>
      </ul>
    </onClickOutside>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "DisplayMenu",
  components: {},
})
export default class DisplayMenu extends Vue {
  currentZoom = 100;
  zoomActions = ["Zoom In", "Zoom Out", "Fit All", "50%", "100%", "150%"];
  showMenu = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
</script>

<style scoped lang="scss">
@import "../style";

#display-options {
  right: 8px;
}
</style>
