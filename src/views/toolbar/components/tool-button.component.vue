<template>
  <button
    class="flex-center tb-btn tool-btn"
    @click.stop="onToolClick()"
    :class="{ 'selected-btn': activeTool == buttonData.tool }"
    :title="buttonData.title"
  >
    <i v-html="buttonData.svg" />
  </button>
</template>

<script lang="ts">
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { GraphxMixin } from "@/common/mixins/graphx.mixin";
import { mixins, Options } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
  name: "Tool Button",
})
export default class ToolButton extends mixins(GraphxMixin) {
  @Prop() buttonData!: { svg: string; tool: ToolInput; title: string };

  onToolClick(): void {
    this.updateTool(this.buttonData.tool);
  }
}
</script>

<style scoped lang="scss">
@import "../style";

.tool-btn {
  cursor: default;

  i {
    color: #fff;
    height: 20px;
    width: 20px;
  }
}
</style>
