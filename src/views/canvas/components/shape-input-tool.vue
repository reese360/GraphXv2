<template>
  <rect
    v-if="renderTool && selectedShape == ShapeInput.RECTANGLE"
    :x="shapePosition.x1"
    :y="shapePosition.y1"
    :width="shapePosition.x2"
    :height="shapePosition.y2"
    stroke-width="1"
    stroke="#09f"
    fill="none"
  />
  <ellipse
    v-else-if="renderTool && selectedShape == ShapeInput.ELLIPSE"
    :cx="shapePosition.x1"
    :cy="shapePosition.y1"
    :rx="shapePosition.x2"
    :ry="shapePosition.y2"
    stroke="#09f"
    stroke-width="1"
    fill="none"
    style="outline: 1px solid #09f"
  />
  <line
    v-else-if="renderTool && selectedShape == ShapeInput.LINE"
    :x1="shapePosition.x1"
    :y1="shapePosition.y1"
    :x2="shapePosition.x2"
    :y2="shapePosition.y2"
    stroke="#09f"
    stroke-width="1"
  />
  <polygon
    v-else-if="renderTool && selectedShape == ShapeInput.POLYGON"
    stroke="#09f"
    fill="none"
    stroke-width="1"
    :points="polyPoints"
    style="outline: 1px solid #09f"
  />
</template>

<script lang="ts">
import { ShapeModel } from "@/common/models/shapes/Shape.model";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { ShapePosition } from "@/common/models/shapes/shapePosition.model";
import { v4 as uuidv4 } from "uuid";
import { mixins, Options } from "vue-class-component";
import { eventBus } from "@/proxies/event-bus.proxy";
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import * as boundsUtility from "@/utility/shapeBounds.utility";

@Options({
  name: "ShapeInputTool",
  components: {},
})
export default class ShapeInputTool extends mixins(GraphxMixin) {
  private origin: { x: number; y: number } | null = null;
  private shapePosition: ShapePosition | null = null;
  private polygonPoints: [number, number][] = [];
  private areaLimit = 20; // used to filter accidental shapes
  public isDrawing = false;

  ShapeInput = ShapeInput;

  get renderTool(): boolean {
    return !!this.origin && !!this.shapePosition;
  }

  get polyPoints(): string {
    if (this.shapePosition) {
      const p1: [number, number] = [
        (this.shapePosition.x1 + this.shapePosition.x2) / 2,
        this.shapePosition.y1,
      ];
      const p2: [number, number] = [
        this.shapePosition.x1,
        this.shapePosition.y2,
      ];
      const p3: [number, number] = [
        this.shapePosition.x2,
        this.shapePosition.y2,
      ];
      this.polygonPoints = [p1, p2, p3];
      return `${p1.join()}, ${p2.join()} ${p3.join()}`;
    }
    return "";
  }

  calcShapeArea(): number {
    return (
      this.$el.getBoundingClientRect().width *
      this.$el.getBoundingClientRect().height
    );
  }

  startDraw(pos: { x: number; y: number }): void {
    this.isDrawing = true;
    this.origin = pos;
  }

  drawTo(pos: { x: number; y: number }, ratio: boolean): void {
    if (this.isDrawing) {
      switch (this.selectedShape) {
        case ShapeInput.RECTANGLE: {
          this.shapePosition = {
            x1: Math.min(this.origin!.x, pos.x),
            y1: Math.min(this.origin!.y, pos.y),
            x2: Math.abs(pos.x - this.origin!.x),
            y2: Math.abs(pos.y - this.origin!.y),
          };
          break;
        }
        case ShapeInput.LINE: {
          this.shapePosition = {
            x1: this.origin!.x,
            y1: this.origin!.y,
            x2: pos.x,
            y2: pos.y,
          };
          break;
        }
        case ShapeInput.ELLIPSE: {
          const x1 = (this.origin!.x + pos.x) / 2;
          const y1 = (this.origin!.y + pos.y) / 2;
          const x2 = Math.abs(pos.x - x1);
          const y2 = Math.abs(pos.y - y1);

          this.shapePosition = {
            x1,
            x2,
            y1,
            y2,
          };

          break;
        }
        case ShapeInput.POLYGON: {
          this.shapePosition = {
            x1: Math.min(this.origin!.x, pos.x),
            y1: Math.min(this.origin!.y, pos.y),
            x2: Math.max(pos.x, this.origin!.x),
            y2: Math.max(pos.y, this.origin!.y),
          };
        }
      }
    }
  }

  cancelDraw(): void {
    this.isDrawing = false;
    this.origin = null;
    this.shapePosition = null;
  }

  endDraw(): void {
    if (this.isDrawing) {
      // build shape object
      if (this.shapePosition && this.calcShapeArea() >= this.areaLimit) {
        const shape: ShapeModel = {
          id: uuidv4(),
          name: `${this.selectedShape}-${this.shapeCollection.size}`,
          type: this.selectedShape,
          position:
            this.selectedShape == ShapeInput.POLYGON
              ? this.polygonPoints
              : this.shapePosition!,
          origin:
            this.selectedShape == ShapeInput.POLYGON
              ? this.polygonPoints
              : { x: this.shapePosition.x1, y: this.shapePosition.y1 },
          selected: false,
          properties: {
            strokeWidth: this.activeStrokeWidth,
            fill: this.activeFillColor,
            stroke: this.activeStrokeColor,
          },
          getBounds:
            this.selectedShape == ShapeInput.RECTANGLE
              ? boundsUtility.getRectBounds
              : this.selectedShape == ShapeInput.ELLIPSE
              ? boundsUtility.getEllipseBounds
              : this.selectedShape == ShapeInput.LINE
              ? boundsUtility.getLineBounds
              : boundsUtility.getPolyBounds,
        };
        this.addShape(shape);
        // this.updateTool(ToolInput.SELECT); // shape will be selected
      }
    }

    this.origin = null;
    this.shapePosition = null;
    this.isDrawing = false;
  }
}
</script>

<style scoped lang="scss"></style>
