import { IShape } from "@/common/models/shapes/IShape.interface";

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

  get shapeCollection(): Map<string, IShape> {
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

  async updateTool(t: ToolInput): Promise<void> {
    graphxModule.updateTool(t);
  }

  async updateStrokeWidth(s: number): Promise<void> {
    graphxModule.updateStrokeWidth(s);
  }

  addShape(shape: IShape): void {
    graphxModule.addShape(shape);
  }

  deleteShape(id: string): void {
    graphxModule.deleteShape(id);
  }

  lookupShape(id: string): IShape | null {
    return graphxModule.lookupShape(id) ?? null;
  }
}
