import { IShape } from "@/common/models/shapes/IShape.interface";
import { ToolInput } from "./../common/constants/enums/ToolInput.enum";
import { ShapeInput } from "./../common/constants/enums/ShapeInput.enum";
import { Action, Module, VuexModule } from "vuex-class-modules";
import Polygon from "@/common/models/shapes/polygon.shape";

@Module({ generateMutationSetters: true })
class GraphxModule extends VuexModule {
  private _selectedShape: ShapeInput = ShapeInput.RECTANGLE;
  private _activeTool: ToolInput = ToolInput.SELECT;
  private _activeStrokeColor = "#000";
  private _activeStrokeWidth = 1;
  private _activeFillColor = "#c3f";
  private _shapeCollection: Map<string, IShape> = new Map<string, IShape>();

  get selectedShape(): ShapeInput {
    return this._selectedShape;
  }

  get activeTool(): ToolInput {
    return this._activeTool;
  }

  get shapeCollection(): Map<string, IShape> {
    return this._shapeCollection;
  }

  get activeStrokeColor() {
    return this._activeStrokeColor;
  }

  get activeStrokeWidth() {
    return this._activeStrokeWidth;
  }

  get activeFillColor() {
    return this._activeFillColor;
  }

  init(): void {
    this.addShape(
      new Ellipse({
        name: "Ellipse-0",
        position: {
          x1: 200,
          y1: 200,
          x2: 100,
          y2: 100,
        },
        properties: {
          strokeWidth: 2,
          fill: "#3ac",
          stroke: "#000",
        },
      })
    );

    // this.addShape(
    // 	new Polygon({
    // 		name: 'Polygon-0',
    // 		position: [
    // 			[669, 44],
    // 			[558, 256],
    // 			[781, 256],
    // 		],
    // 		properties: {
    // 			strokeWidth: 2,
    // 			fill: '#09f',
    // 			stroke: '#000',
    // 		},
    // 	})
    // );
  }

  @Action updateShape(s: ShapeInput) {
    this._selectedShape = s;
  }

  @Action async updateTool(t: ToolInput): Promise<void> {
    this._activeTool = t;
  }

  @Action async addShape(s: IShape): Promise<void> {
    this._shapeCollection.set(s.id, s);
  }

  @Action updateStrokeWidth(w: number): void {
    this._activeStrokeWidth = w;
  }

  @Action updateFillColor(color: string): void {
    this._activeFillColor = color;
  }

  @Action updateStrokeColor(color: string): void {
    this._activeStrokeColor = color;
  }

  lookupShape(id: string): IShape | null {
    return this._shapeCollection.get(id) ?? null;
  }

  deleteShape(id: string): void {
    this._shapeCollection.delete(id);
  }
}

import store from "./index";
import { BusEvent } from "@/common/constants/enums/BusEvent.enum";
import Ellipse from "@/common/models/shapes/ellipse.shape";
export const graphxModule = new GraphxModule({ store, name: "graphx" });
