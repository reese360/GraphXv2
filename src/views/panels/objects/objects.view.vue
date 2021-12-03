<template>
  <div class="col-view" @click="onEmptyClick()">
    <!-- VIEW HEADER -->
    <div class="view-row view-section border-b flex-row">
      <i class="view-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="7" r="4"></circle>
          <circle cx="6.5" cy="17" r="4"></circle>
          <circle cx="17.5" cy="17" r="4"></circle>
        </svg>
      </i>
      <span>Objects</span>
    </div>
    <!-- OBJECT LIST -->
    <div class="object-view">
      <ul>
        <li v-for="(shapeId, idx) in shapeData" :key="idx" class="flex-row">
          <object-item :itemId="shapeId" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { eventBus } from "@/proxies/event-bus.proxy";
import { mixins, Options } from "vue-class-component";
import ObjectItem from "./components/object-item.component.vue";

@Options({
  name: "ObjectsView",
  components: { ObjectItem },
})
export default class ObjectsView extends mixins(GraphxMixin) {
  get shapeData(): string[] {
    return Array.from(this.shapeCollection, ([k, v]) => k);
  }

  onEmptyClick(): void {
    eventBus.emit(BusEvent.DESELECT);
  }
}
</script>

<style scoped lang="scss">
@import "../style";

.object-view {
  height: auto;
}
</style>
