<template>
  <div class="tb-menu-wrapper">
    <button
      class="flex-center tb-btn"
      id="shapeTool"
      @click.stop="onToolSelect()"
      :class="{
        'selected-btn': activeTool == ToolInput.SHAPE,
        'open-menu': showMenu,
      }"
      :title="currentShape.shape"
    >
      <i v-html="currentShape.svg"></i>
      <button class="menu-trigger-btn" @click.stop="toggleMenu()">
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
    </button>
    <onClickOutside
      @trigger="toggleMenu()"
      v-if="showMenu"
      class="tb-menu"
      id="shape-options"
    >
      <ul class="tb-list">
        <li v-for="(shape, idx) in shapeOptions" :key="idx">
          <button
            class="flex-row shape-btn"
            @click.stop="onShapeClick(shape.tool)"
          >
            <i v-html="shape.svg" />
            <span v-html="shape.shape" />
          </button>
        </li>
      </ul>
    </onClickOutside>
  </div>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";

type Shape = { shape: string; svg: string; tool: ShapeInput };

@Options({
  name: "ShapeMenu",
  components: {},
})
export default class ShapeMenu extends mixins(GraphxMixin) {
  showMenu = false;

  ToolInput = ToolInput;

  shapeOptions: Shape[] = [
    {
      shape: "Line",
      tool: ShapeInput.LINE,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<line x1="4" y1="4" x2="20" y2="20"></line> 
					</svg>`,
    },
    {
      shape: "Rectangle",
      tool: ShapeInput.RECTANGLE,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
    },
    {
      shape: "Ellipse",
      tool: ShapeInput.ELLIPSE,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="9"></circle>
					</svg>`,
    },
    {
      shape: "Polygon",
      tool: ShapeInput.POLYGON,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75">
						</path>
					</svg>`,
    },
  ];

  get currentShape(): Shape {
    return this.shapeOptions.find((s) => s.tool == this.selectedShape)!;
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  onShapeClick(shape: ShapeInput): void {
    this.updateShape(shape);
    this.onToolSelect();
  }

  onToolSelect(): void {
    this.updateTool(ToolInput.SHAPE);
    if (this.showMenu) this.toggleMenu();
  }
}
</script>

<style scoped lang="scss">
@import "../style";

#shapeTool {
  cursor: default;
}

.shape-btn {
  gap: 8px;
}
</style>
