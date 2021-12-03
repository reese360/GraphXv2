<template>
  <div>
    <tools-view />
    <div class="flex-row">
      <objects-view />
      <canvas-view />
      <properties-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ToolsView from "@/views/toolbar/toolbar.view.vue";
import ObjectsView from "@/views/panels/objects/objects.view.vue";
import CanvasView from "@/views/canvas.view.vue";
import PropertiesView from "@/views/panels/properties/properties.view.vue";
import { graphxModule } from "./store/graphx.vuex";

@Options({
  name: "App",
  components: { ToolsView, ObjectsView, CanvasView, PropertiesView },
})
export default class App extends Vue {
  created(): void {
    graphxModule.init();
  }
}
</script>

<style lang="scss">
@import "@/scss/style.scss";
#app {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}
</style>
