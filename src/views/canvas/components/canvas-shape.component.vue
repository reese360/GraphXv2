<template>
  <rect
    v-if="shape.type == ShapeInput.RECTANGLE"
    :x="shape.position.x1"
    :y="shape.position.y1"
    :width="shape.position.x2"
    :height="shape.position.y2"
    :stroke-width="shape.properties.strokeWidth"
    :stroke="shape.properties.stroke"
    :fill="shape.properties.fill"
    :id="id"
    :class="{ isSelected: shape.selected }"
  />
  <ellipse
    v-else-if="shape.type == ShapeInput.ELLIPSE"
    :cx="shape.position.x1"
    :cy="shape.position.y1"
    :rx="shape.position.x2"
    :ry="shape.position.y2"
    :stroke-width="shape.properties.strokeWidth"
    :stroke="shape.properties.stroke"
    :fill="shape.properties.fill"
    :id="id"
    :class="{ isSelected: shape.selected }"
  />
  <line
    v-else-if="shape.type == ShapeInput.LINE"
    :x1="shape.position.x1"
    :y1="shape.position.y1"
    :x2="shape.position.x2"
    :y2="shape.position.y2"
    :stroke-width="shape.properties.strokeWidth"
    :stroke="shape.properties.stroke"
    :fill="shape.properties.fill"
    :id="id"
    :class="{ isSelected: shape.selected }"
  />
  <polygon
    v-else-if="shape.type == ShapeInput.POLYGON"
    :points="polyPosition"
    :stroke-width="shape.properties.strokeWidth"
    :stroke="shape.properties.stroke"
    :fill="shape.properties.fill"
    :id="id"
    :class="{ isSelected: shape.selected }"
    style="stroke-linejoin: round"
  />
</template>

<script lang="ts">
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
  name: "CanvasShape",
})
export default class CanvasShape extends mixins(GraphxMixin) {
  @Prop() id!: string;
  shape!: IShape;

  ShapeInput = ShapeInput;

  get polyPosition() {
    return (this.shape.position as [number, number][]).join();
  }

  created(): void {
    this.shape = this.lookupShape(this.id)!;
    this.$log(this.id, this.shape);
  }

  mounted(): void {
    this.shape.element = this.$el;
    if (this.activeTool == ToolInput.SHAPE)
      eventBus.emit(BusEvent.SELECT, {
        id: this.shape.id,
        multiSelect: false,
      });
  }
}
</script>

<style scoped lang="scss">
.isSelected {
  cursor: move;
}
</style>
