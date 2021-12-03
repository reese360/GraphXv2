<template>
  <button
    class="object-item-btn flex-row"
    @click.stop="onSingleClick($event)"
    @dblclick="onDoubleClick()"
    :class="{ selected: itemData.selected }"
  >
    <i v-html="shapeIcon" :title="itemData.type" />
    <span v-if="!editName">{{ label }}</span>
    <div v-else>
      <input
        type="text"
        class="shape-name-input"
        v-model="itemData.name"
        @blur="onInputBlur()"
        @keydown.enter="onInputBlur()"
        autocorrect="off"
        autocomplete="off"
        :id="inputId"
      />
    </div>
  </button>
</template>

<script lang="ts">
import { ShapeModel } from "@/common/models/shapes/Shape.model";
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

@Options({
  name: "ObjectItem",
  components: {},
})
export default class ObjectItem extends mixins(GraphxMixin) {
  @Prop() itemId!: string;
  itemData!: ShapeModel;
  editName = false;

  created(): void {
    this.itemData = this.lookupShape(this.itemId)!;
  }

  get inputId(): string {
    return `ni-${this.itemData.id}`;
  }

  get label(): string {
    return this.itemData.name?.length ? this.itemData.name : this.itemData.id;
  }

  get shapeIcon(): string {
    if (this.itemData.type == ShapeInput.RECTANGLE)
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					shape-rendering="crispEdges" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
						<rect x="4" y="4" width="18" height="18"></rect>
					</svg>`;
    if (this.itemData.type == ShapeInput.LINE)
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" stroke-width="1"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">
						<line x1="4" y1="4" x2="20" y2="20"></line> 
					</svg>`;
    if (this.itemData.type == ShapeInput.ELLIPSE)
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" stroke-width="1"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">
						<circle cx="12" cy="12" r="9"></circle>
					</svg>`;
    if (this.itemData.type == ShapeInput.POLYGON)
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" stroke-width="1"
						stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<polygon points="12,4 4,20 20,20"></polygon>
						</path>
					</svg>`;
    return "";
  }

  onSingleClick(e: PointerEvent): void {
    // if (this.itemData.selected && e.shiftKey)
    // 	eventBus.emit(BusEvent.DESELECT, this.itemId);
    // else
    eventBus.emit(BusEvent.SELECT, {
      id: this.itemId,
      multiSelect: e.shiftKey,
    });
  }

  onDoubleClick(): void {
    this.editName = true;
    setTimeout(() => {
      // DOM needs moment to render input field
      document.getElementById(this.inputId)?.focus();
    }, 0);
  }

  deselect(): void {
    this.itemData.selected = false;
  }

  onInputBlur(): void {
    this.editName = false;
  }
}
</script>

<style scoped lang="scss">
.object-item-btn {
  outline: none;
  font-size: 11px;
  width: 100%;
  padding: 6px;
  min-height: 30px;
  gap: 6px;

  i {
    height: 14px;
    width: 14px;
  }

  &.selected {
    background: lighten($color-primary, 10%);
    color: #fff;
  }
}

.shape-name-input {
  height: 11px;
  width: 35ch;
  padding: 2px;
  font-size: 11px;
  outline: none;
  border: none;
}
</style>
