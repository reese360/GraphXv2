<template>
  <rect
    v-if="shapeData.type == ShapeInput.RECTANGLE"
    :x="shapeData.position.x1"
    :y="shapeData.position.y1"
    :width="shapeData.position.x2"
    :height="shapeData.position.y2"
    :stroke-width="shapeData.properties.strokeWidth"
    :stroke="shapeData.properties.stroke"
    :fill="shapeData.properties.fill"
    :id="id"
    :class="{ isSelected: shapeData.selected }"
    :key="shapeData.key"
  />
  <ellipse
    v-else-if="shapeData.type == ShapeInput.ELLIPSE"
    :cx="shapeData.position.x1"
    :cy="shapeData.position.y1"
    :rx="shapeData.position.x2"
    :ry="shapeData.position.y2"
    :stroke-width="shapeData.properties.strokeWidth"
    :stroke="shapeData.properties.stroke"
    :fill="shapeData.properties.fill"
    :id="id"
    :class="{ isSelected: shapeData.selected }"
    :key="shapeData.key"
  />
  <line
    v-else-if="shapeData.type == ShapeInput.LINE"
    :x1="shapeData.position.x1"
    :y1="shapeData.position.y1"
    :x2="shapeData.position.x2"
    :y2="shapeData.position.y2"
    :stroke-width="shapeData.properties.strokeWidth"
    :stroke="shapeData.properties.stroke"
    :fill="shapeData.properties.fill"
    :id="id"
    :class="{ isSelected: shapeData.selected }"
    :key="shapeData.key"
  />
  <polygon
    v-else-if="shapeData.type == ShapeInput.POLYGON"
    :points="shapeData.position"
    :stroke-width="shapeData.properties.strokeWidth"
    :stroke="shapeData.properties.stroke"
    :fill="shapeData.properties.fill"
    :id="id"
    :class="{ isSelected: shapeData.selected }"
    :key="shapeData.key"
  />
</template>

<script lang="ts">
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { ShapeModel } from "@/common/models/shapes/Shape.model";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
  name: "CanvasShape",
})
export default class CanvasShape extends mixins(GraphxMixin) {
  @Prop() id!: string;
  shapeData!: ShapeModel;
  seedKey = this.getRandomInt(); // used to refresh after render

  ShapeInput = ShapeInput;

  created(): void {
    this.shapeData = this.lookupShape(this.id)!;
  }

  mounted(): void {
    this.shapeData.element = this.$el;
    if (this.activeTool == ToolInput.SHAPE)
      eventBus.emit(BusEvent.SELECT, {
        id: this.shapeData.id,
        multiSelect: false,
      });
  }

  getRandomInt(): number {
    return Math.floor(Math.random() * 500);
  }
}
</script>

<style scoped lang="scss">
.isSelected {
  // outline: 2px solid #09f;
  cursor: move;
}
</style>
