<template>
  <g>
    <rect
      v-if="renderTool"
      :x="rectPosition.x1"
      :y="rectPosition.y1"
      :width="rectPosition.x2"
      :height="rectPosition.y2"
      stroke-width="1"
      stroke="#09f"
      fill="none"
    />
    <ellipse
      v-if="renderTool && selectedShape == ShapeInput.ELLIPSE"
      :cx="shapePosition.x1"
      :cy="shapePosition.y1"
      :rx="shapePosition.x2"
      :ry="shapePosition.y2"
      stroke="#09f"
      stroke-width="1"
      fill="none"
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
  </g>
</template>

<script lang="ts">
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { ShapePosition } from "@/common/models/shapePosition.type";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { mixins, Options } from "vue-class-component";
import { ShapeData } from "@/common/models/shapeData.type";
import Rectangle from "@/common/models/shapes/rect.shape";
import Ellipse from "@/common/models/shapes/ellipse.shape";
import Line from "@/common/models/shapes/line.shape";
import Polygon from "@/common/models/shapes/polygon.shape";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { eventBus } from "@/proxies/event-bus.proxy";
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";

@Options({
  name: "ShapeInputTool",
  components: {},
})
export default class ShapeInputTool extends mixins(GraphxMixin) {
  private origin: { x: number; y: number } | null = null;
  private shapePosition: ShapePosition | null = null;
  private rectPosition: ShapePosition | null = null;
  private polygonPoints: [number, number][] = [];
  private areaLimit = 20; // used to filter small/accidental shapes
  public isDrawing = false;

  ShapeInput = ShapeInput;

  get renderTool(): boolean {
    return !!this.origin && !!this.shapePosition;
  }

  get finalShapePosition(): ShapePosition {
    return {
      x1: this.shapePosition!.x1 + Math.ceil(this.activeStrokeWidth / 2),
      y1: this.shapePosition!.y1 + Math.ceil(this.activeStrokeWidth / 2),
      x2: this.shapePosition!.x2 - Math.ceil(this.activeStrokeWidth),
      y2: this.shapePosition!.y2 - Math.ceil(this.activeStrokeWidth),
    };
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
      this.rectPosition = {
        x1: Math.min(this.origin!.x, pos.x),
        y1: Math.min(this.origin!.y, pos.y),
        x2: Math.abs(pos.x - this.origin!.x),
        y2: Math.abs(pos.y - this.origin!.y),
      };

      switch (this.selectedShape) {
        case ShapeInput.RECTANGLE: {
          // this.shapePosition = {
          // 	x1: Math.min(this.origin!.x, pos.x),
          // 	y1: Math.min(this.origin!.y, pos.y),
          // 	x2: Math.abs(pos.x - this.origin!.x),
          // 	y2: Math.abs(pos.y - this.origin!.y),
          // };
          this.shapePosition = this.rectPosition;
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

  endDraw(): void {
    if (this.isDrawing) {
      if (this.shapePosition && this.calcShapeArea() >= this.areaLimit) {
        // get shape data settings
        const shapeData: ShapeData = {
          name: `${this.selectedShape}-${this.shapeCollection.size}`,
          position:
            this.selectedShape == ShapeInput.POLYGON
              ? this.polygonPoints
              : this.shapePosition,
          properties: {
            strokeWidth: this.activeStrokeWidth,
            fill: this.activeFillColor,
            stroke: this.activeStrokeColor,
          },
        };
        const shape = this.newShape(shapeData);
        shape.selected = true;
        this.addShape(shape);
        this.updateTool(ToolInput.SELECT).then(() =>
          eventBus.emit(BusEvent.SELECT, { id: shape.id, multiSelect: false })
        );
      }
    }

    this.origin = null;
    this.shapePosition = null;
    this.isDrawing = false;
  }

  cancelDraw(): void {
    this.isDrawing = false;
    this.origin = null;
    this.shapePosition = null;
  }

  newShape(shapeData: ShapeData): IShape {
    if (this.selectedShape == ShapeInput.RECTANGLE)
      return new Rectangle(shapeData);
    if (this.selectedShape == ShapeInput.ELLIPSE) return new Ellipse(shapeData);
    if (this.selectedShape == ShapeInput.LINE) return new Line(shapeData);
    else return new Polygon(shapeData);
  }
}
</script>

<style scoped lang="scss"></style>
