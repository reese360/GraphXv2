<template>
  <div class="tool-view flex-row">
    <div class="flex-row">
      <main-menu />
      <tool-button :buttonData="tools[0]" />
      <tool-button :buttonData="tools[1]" />
      <shape-menu />
      <tool-button :buttonData="tools[2]" />
      <tool-button :buttonData="tools[3]" />
    </div>
    <display-menu />
  </div>
</template>

<script lang="ts">
import { ToolInput } from "@/common/constants/enums/ToolInput.enum";
import { Options, Vue } from "vue-class-component";
import ShapeMenu from "./components/shape-menu.component.vue";
import ToolButton from "./components/tool-button.component.vue";
import DisplayMenu from "./components/display-menu.component.vue";
import MainMenu from "./components/main-menu.component.vue";

@Options({
  name: "ToolBar",
  components: { ShapeMenu, ToolButton, DisplayMenu, MainMenu },
})
export default class ToolsView extends Vue {
  tools: { tool: ToolInput; svg: string; title?: string }[] = [
    {
      tool: ToolInput.SELECT,
      title: "Select",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-0.5 -0.5 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>`,
    },
    {
      tool: ToolInput.PENCIL,
      title: "Draw",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-0.5 -0.5 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
    },
    {
      tool: ToolInput.TEXT,
      title: "Text",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" ><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
    },
    {
      tool: ToolInput.PAN,
      title: "Pan",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width=".9" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5"></path> <path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5"></path> <path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5"></path> <path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"> </path> </svg>`,
    },
  ];

  // x = setup(() => {
  // 	return useMouse().x;
  // });
}
</script>

<style scoped lang="scss">
.tool-view {
  height: $tools-height;
  width: 100vw;
  background: #383838;
  justify-content: space-between;
}

.graphx-logo {
  fill: #fff;
  color: #fff;
}
</style>
