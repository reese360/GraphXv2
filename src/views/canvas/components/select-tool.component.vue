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
    <g v-if="!dragOrigin">
      <rect
        v-for="(outline, idx) in shapeOutlines"
        :key="idx"
        :x="outline.x1"
        :y="outline.y1"
        :width="outline.x2"
        :height="outline.y2"
        stroke-width="2"
        stroke="#09f"
        fill="none"
      />
    </g>
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
import { ShapeModel } from "@/common/models/shapes/Shape.model";
import { ShapePosition } from "@/common/models/shapes/shapePosition.model";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";

@Options({
  name: "SelectionTool",
  components: {},
})
export default class SelectionTool extends mixins(GraphxMixin) {
  private selectedShapes: Map<
    string,
    { shape: ShapeModel; outline: ShapePosition }
  > = new Map();

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
        const o = shape.outline;
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

  get shapeOutlines(): ShapePosition[] {
    return Array.from(this.selectedShapes, ([k, v]) => v.outline);
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
  }

  getShapeOutline(shape: ShapeModel): ShapePosition {
    const getRectBounds = () => {
      return {
        x1:
          (shape.position as ShapePosition).x1 -
          Math.ceil(shape.properties!.strokeWidth / 2),
        y1:
          (shape.position as ShapePosition).y1 -
          Math.ceil(shape.properties!.strokeWidth / 2),
        x2:
          (shape.position as ShapePosition).x2 + shape.properties!.strokeWidth,
        y2:
          (shape.position as ShapePosition).y2 + shape.properties!.strokeWidth,
      };
    };
    if (shape.type == ShapeInput.RECTANGLE) return getRectBounds();

    const getEllipseBounds = () => {
      return {
        x1:
          (shape.position as ShapePosition).x1 -
          (shape.position as ShapePosition).x2 -
          Math.ceil(shape.properties!.strokeWidth / 2),
        y1:
          (shape.position as ShapePosition).y1 -
          (shape.position as ShapePosition).y2 -
          Math.ceil(shape.properties!.strokeWidth / 2),
        x2:
          (shape.position as ShapePosition).x2 * 2 +
          shape.properties!.strokeWidth,
        y2:
          (shape.position as ShapePosition).y2 * 2 +
          shape.properties!.strokeWidth,
      };
    };

    if (shape.type == ShapeInput.ELLIPSE) return getEllipseBounds();

    const getPolyBounds = () => {
      const box = shape.element!.getBoundingClientRect();
      // TODO - remove hardcoded margins
      return {
        x1: box.x - 0.5 - 260 - shape.properties!.strokeWidth,
        y1: box.y - 0.5 - 40 - shape.properties!.strokeWidth,
        x2: box.width + shape.properties!.strokeWidth * 2,
        y2: box.height + shape.properties!.strokeWidth * 2,
      };
    };
    if (shape.type == ShapeInput.POLYGON) return getPolyBounds();

    const getLineBounds = () => {
      return {
        x1: (shape.position as ShapePosition).x1,
        y1: (shape.position as ShapePosition).y1,
        x2:
          (shape.position as ShapePosition).x2 -
          (shape.position as ShapePosition).x1,
        y2:
          (shape.position as ShapePosition).y2 -
          (shape.position as ShapePosition).y1,
      };
    };
    if (shape.type == ShapeInput.LINE) return getLineBounds();

    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };
  }

  onToolDown(
    targetId: string | null,
    pos: { x: number; y: number },
    multiSelect: boolean
  ): void {
    if (targetId) {
      if (this.selectedShapes.has(targetId)) this.startDrag(pos);
      else this.select(targetId, multiSelect);
      return;
    }

    if (pos) {
      this.isSelecting = true;
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
      if (s.shape.type == ShapeInput.POLYGON) {
        // do polygon shit
      } else {
        const shapePos = s.shape.position as ShapePosition;
        const origin = s.shape.origin as { x: number; y: number };
        shapePos.x1 = origin.x + dX;
        shapePos.y1 = origin.y + dY;

        s.outline = this.getShapeOutline(s.shape);
      }
    });
  }

  async endDrag(): Promise<void> {
    this.dragOrigin = null;
    this.isDragging = false;

    this.selectedShapes.forEach((s) => {
      if (s.shape.type == ShapeInput.POLYGON) {
        // do polygon shit
      } else {
        const shapePos = s.shape.position as ShapePosition;
        const origin = s.shape.origin as { x: number; y: number };
        origin.x = shapePos.x1;
        origin.y = shapePos.y1;
      }
    });

    if (this.selectedShapes.has("00000-00000-00000")) {
      this.$log(
        this.selectedShapes.get("00000-00000-00000")!.shape,
        this.selectedShapes.get("00000-00000-00000")!.outline
      );
    }
  }

  startSelect(pos: { x: number; y: number }, multiSelect = false): void {
    if (!multiSelect) this.resetSelection();
    this.dragOrigin = pos;
    this.isSelecting = true;
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
      this.selectedShapes.set(id, {
        shape,
        outline: this.getShapeOutline(shape),
      });
    }
  }

  deselect(id: string): void {
    const sel = this.selectedShapes.get(id);
    if (sel) {
      sel.shape.selected = false;
      this.selectedShapes.delete(id);
    }
  }

  resetSelection(): void {
    this.selectedShapes.forEach((s) => (s.shape.selected = false));
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
