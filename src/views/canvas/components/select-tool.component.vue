<template>
  <g>
    <!-- DRAG SELECT BOX -->
    <rect
      v-if="dragSelect"
      :x="dragSelect.x1"
      :y="dragSelect.y1"
      :width="dragSelect.x2"
      :height="dragSelect.y2"
      stroke-width="1"
      stroke="#09f"
      fill="#73c7ff86"
    />

    <!-- INNER SELECTION BOXES -->
    <rect
      v-for="(shape, idx) in shapes"
      :key="idx"
      :x="shape.x1"
      :y="shape.y1"
      :width="shape.x2"
      :height="shape.y2"
      stroke-width="1"
      stroke="#09f"
      fill="none"
    />
    <!-- <rect
			v-for="(outline, idx) in shapeOutlines"
			:key="idx"
			:x="outline.x1"
			:y="outline.y1"
			:width="outline.x2"
			:height="outline.y2"
			stroke-width="1"
			stroke="#09f"
			fill="none"
		/> -->
    <!-- OUTER SELECTION BOX -->
    <rect
      v-if="selectionOutline"
      :x="selectionOutline.x1"
      :y="selectionOutline.y1"
      :width="selectionOutline.x2"
      :height="selectionOutline.y2"
      stroke-width="2"
      stroke="#09f"
      fill="none"
    />
  </g>
</template>

<script lang="ts">
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { ShapePosition } from "@/common/models/shapePosition.type";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";

@Options({
  name: "SelectionTool",
  components: {},
})
export default class SelectionTool extends mixins(GraphxMixin) {
  private selectedShapes: Map<string, IShape> = new Map();

  private dragOrigin: { x: number; y: number } | null = null;
  private dragSelect: ShapePosition | null = null;

  public isSelecting = false;
  public isDragging = false;

  get hasSelection(): boolean {
    return this.selectedShapes.size != 0;
  }

  // outline surrounding all selected shapes
  get selectionOutline(): ShapePosition | null {
    if (this.selectedShapes.size > 1) {
      let x: number | null = null;
      let y: number | null = null;
      let h: number | null = null;
      let w: number | null = null;

      this.selectedShapes.forEach((shape) => {
        const o = shape.bounds;
        x = x ? Math.min(x, o.x1) : o.x1;
        y = y ? Math.min(y, o.y1) : o.y1;
        w = w ? Math.max(w, o.x1 + o.x2) : o.x1 + o.x2;
        h = h ? Math.max(h, o.y1 + o.y2) : o.y1 + o.y2;
      });

      return {
        x1: x!,
        y1: y!,
        x2: w! - x!,
        y2: h! - y!,
      };
    }
    return null;
  }

  get shapes(): ShapePosition[] {
    return Array.from(this.selectedShapes, ([k, v]) => v.bounds);
  }

  created(): void {
    eventBus.on(BusEvent.SELECT, (eventData: unknown) => {
      const { id, multiSelect } = eventData as {
        id: string;
        multiSelect: boolean;
      };

      this.select(id, multiSelect);
    });

    eventBus.on(BusEvent.DESELECT, (eventData: unknown) => {
      if (this.selectedShapes.size) {
        if (eventData) this.deselect(eventData as string);
        else this.resetSelection();
      }
    });

    eventBus.on(BusEvent.DELETE, (eventData: unknown) => {
      this.deleteSelectedShapes();
    });
  }

  deleteSelectedShapes(): void {
    this.selectedShapes.forEach((shape) => {
      this.deleteShape(shape.id);
    });
    this.selectedShapes.clear();
  }

  onToolDown(
    targetId: string | null,
    pos: { x: number; y: number },
    multiSelect: boolean
  ): void {
    if (targetId) {
      if (multiSelect && this.selectedShapes.has(targetId))
        this.deselect(targetId);
      else if (!this.selectedShapes.has(targetId))
        this.select(targetId, multiSelect);

      this.startDrag(pos);
      return;
    }

    if (pos) {
      this.startSelect(pos, multiSelect);
      return;
    }
  }

  onToolMove(pos: { x: number; y: number }): void {
    if (this.isSelecting) {
      this.selectTo(pos);
      return;
    }

    if (this.dragOrigin) {
      this.dragTo(pos);
    }
  }

  onToolUp(): void {
    if (this.isDragging) this.endDrag();

    if (this.isSelecting) {
      this.endSelect();
    }
  }

  async startDrag(pos: { x: number; y: number }): Promise<void> {
    this.dragOrigin = pos;
    this.isDragging = true;
  }

  async dragTo(pos: { x: number; y: number }): Promise<void> {
    let dX = pos.x - this.dragOrigin!.x;
    let dY = pos.y - this.dragOrigin!.y;
    this.selectedShapes.forEach((s) => {
      s.dragTo({ x: dX, y: dY });
    });
  }

  async endDrag(): Promise<void> {
    this.dragOrigin = null;
    this.isDragging = false;

    this.selectedShapes.forEach((s) => {
      s.endDrag();
    });
  }

  startSelect(pos: { x: number; y: number }, multiSelect = false): void {
    if (!multiSelect) this.resetSelection();
    this.isSelecting = true;
    this.dragOrigin = pos;
  }

  selectTo(pos: { x: number; y: number }): void {
    if (this.isSelecting) {
      this.dragSelect = {
        x1: Math.min(this.dragOrigin!.x, pos.x),
        y1: Math.min(this.dragOrigin!.y, pos.y),
        x2: Math.abs(pos.x - this.dragOrigin!.x),
        y2: Math.abs(pos.y - this.dragOrigin!.y),
      };
    }
  }

  endSelect(): void {
    if (this.dragSelect) {
      const selectBox = this.$el?.getBoundingClientRect();
      this.selectFromDrag(selectBox);
    }
    this.dragSelect = null;
    this.dragOrigin = null;
    this.isSelecting = false;
  }

  async select(id: string, multiSelect: boolean): Promise<void> {
    if (!multiSelect) this.resetSelection();
    if (!this.selectedShapes.has(id)) {
      const shape = this.lookupShape(id)!;
      shape.selected = true;
      this.selectedShapes.set(id, shape);
    }
  }

  deselect(id: string): void {
    const shape = this.selectedShapes.get(id);
    if (shape) {
      shape.selected = false;
      this.selectedShapes.delete(id);
    }
  }

  resetSelection(): void {
    this.selectedShapes.forEach((s) => (s.selected = false));
    this.selectedShapes.clear();
    this.dragSelect = null;
  }

  async selectFromDrag(selectBox: DOMRect): Promise<void> {
    // find any shapes that overlap with dragSelect box
    this.shapeCollection.forEach((shape, id) => {
      const box = shape.element!.getBoundingClientRect();
      if (
        !(
          box.left >= selectBox.right ||
          box.top >= selectBox.bottom ||
          box.right <= selectBox.left ||
          box.bottom <= selectBox.top
        )
      ) {
        this.select(id, true);
      }
    });
  }

  // rounds number to nearest integer
  normalize(point: number) {
    return Math.round(point);
  }
}
</script>

<style scoped lang="scss"></style>
