<template>
  <div id="canvas-view">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="this.canvasWidth"
      :height="this.canvasHeight"
      :viewBox="viewBox"
      @mousedown.stop="onMouseDown($event)"
      @mousemove="onMouseMove($event)"
      @mouseup="onMouseUp($event)"
      @mouseleave="onMouseLeave()"
      ref="target"
    >
      <canvas-shape
        v-for="(shapeId, idx) in shapeData"
        :key="idx"
        :id="shapeId"
      />

      <shape-input-tool ref="shapeInputTool" />
      <selection-tool ref="selectionTool" />
    </svg>
  </div>
</template>

<script lang="ts">
import CanvasShape from "./canvas/components/canvas-shape.component.vue";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { mixins, Options } from "vue-class-component";
import ShapeInputTool from "./canvas/components/shape-input-tool.vue";
import SelectionTool from "./canvas/components/select-tool.component.vue";

@Options({
  name: "CanvasView",
  components: { CanvasShape, ShapeInputTool, SelectionTool },
})
export default class CanvasView extends mixins(GraphxMixin) {
  canvasWidth = 0;
  canvasHeight = 0;

  shapeInputTool!: ShapeInputTool;
  selectionTool!: SelectionTool;

  // mousePos = setup(() => {
  // 	const { x, y } = useMouse();
  // 	return { x, y };
  // });

  get viewBox(): string {
    return `-0.5 -0.5 ${this.canvasWidth} ${this.canvasHeight}`;
  }

  get shapeData(): string[] {
    return Array.from(this.shapeCollection, ([k, v]) => k);
  }

  // normalizes mouse position on canvas relative to view
  trackMouse(e: MouseEvent): { x: number; y: number } {
    // TODO - remove hardcoded margins
    return { x: e.clientX - 260, y: e.clientY - 40 };
  }

  mounted(): void {
    // set viewbox and svg canvas sizing
    const canvasWrapperEl = document
      .getElementById("canvas-view")!
      .getBoundingClientRect();
    this.canvasWidth = canvasWrapperEl.width;
    this.canvasHeight = canvasWrapperEl.height;

    this.shapeInputTool = this.$refs["shapeInputTool"] as ShapeInputTool;
    this.selectionTool = this.$refs["selectionTool"] as SelectionTool;
  }

  onMouseDown(e: MouseEvent, id?: string): void {
    if (this.activeTool == ToolInput.SHAPE) {
      this.selectionTool.resetSelection();
      this.shapeInputTool.startDraw(this.trackMouse(e));
    }

    if (this.activeTool == ToolInput.SELECT) {
      const targetId = (e.target as HTMLElement).getAttribute("id");
      this.selectionTool.onToolDown(targetId, this.trackMouse(e), e.shiftKey);
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.activeTool == ToolInput.SHAPE && this.shapeInputTool.isDrawing) {
      this.shapeInputTool.drawTo(this.trackMouse(e), e.shiftKey);
      return;
    }

    if (this.activeTool == ToolInput.SELECT) {
      this.selectionTool.onToolMove(this.trackMouse(e));
      return;
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (this.activeTool == ToolInput.SHAPE && this.shapeInputTool.isDrawing) {
      this.shapeInputTool.endDraw();
      return;
    }

    if (this.activeTool == ToolInput.SELECT) {
      this.selectionTool.onToolUp();
      return;
    }
  }

  onMouseLeave(): void {
    if (this.activeTool == ToolInput.SHAPE && this.shapeInputTool.isDrawing) {
      this.shapeInputTool.cancelDraw();
    }
  }
}
</script>

<style scoped lang="scss">
#canvas-view {
  width: 100%;
  height: calc(100vh - #{$tools-height});
  background: #ccc;
  position: relative;
}

.mouse-coords {
  position: absolute;
  top: 0;
}
</style>
