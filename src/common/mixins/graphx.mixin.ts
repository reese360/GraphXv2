import { ShapeModel } from "@/common/models/shapes/Shape.model";

import { ToolInput } from "./../constants/enums/ToolInput.enum";
import { ShapeInput } from "./../constants/enums/ShapeInput.enum";
import { Options, Vue } from "vue-class-component";
import { graphxModule } from "@/store/graphx.vuex";

@Options({})
export class GraphxMixin extends Vue {
  get selectedShape(): ShapeInput {
    return graphxModule.selectedShape;
  }

  get activeTool(): ToolInput {
    return graphxModule.activeTool;
  }

  get shapeCollection(): Map<string, ShapeModel> {
    return graphxModule.shapeCollection;
  }

  get activeFillColor() {
    return graphxModule.activeFillColor;
  }

  get activeStrokeColor() {
    return graphxModule.activeStrokeColor;
  }

  get activeStrokeWidth() {
    return graphxModule.activeStrokeWidth;
  }

  updateShape(s: ShapeInput): void {
    graphxModule.updateShape(s);
  }

  updateTool(t: ToolInput): void {
    graphxModule.updateTool(t);
  }

  addShape(shape: ShapeModel): void {
    graphxModule.addShape(shape);
  }

  lookupShape(id: string): ShapeModel | null {
    return graphxModule.lookupShape(id) ?? null;
  }
}
