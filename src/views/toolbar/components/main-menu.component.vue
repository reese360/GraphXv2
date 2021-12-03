<template>
  <div class="tb-menu-wrapper">
    <button
      class="flex-center tb-btn menu-trigger-btn tb-btn"
      @click.stop="toggleMenu()"
      :class="{ 'open-menu': showMenu }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="-0.5 -0.5 24 24"
        stroke-width="1"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="1" fill="#fff"></circle>
        <path d="M16.924 11.132a5 5 0 1 0 -4.056 5.792"></path>
        <path d="M3 12a9 9 0 1 0 9 -9"></path>
      </svg>
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
      v-if="showMenu"
      @trigger="toggleMenu()"
      class="tb-menu"
      id="main-menu"
    >
      <ul class="tb-list">
        <li v-for="(option, idx) in menuOptions" :key="idx">
          <button @click.stop="onOptionClick(idx)">{{ option }}</button>
        </li>
      </ul>
    </onClickOutside>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "MainMenu",
  components: {},
})
export default class MainMenu extends Vue {
  showMenu = false;

  menuOptions = ["New GraphX", "Save", "Export SVG"];

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  onOptionClick(i: number): void {
    console.log(this.menuOptions[i]);
    this.toggleMenu();
    //TODO - perform action
  }
}
</script>

<style scoped lang="scss">
@import "../style";

#main-menu {
  left: 8px;
}
</style>
