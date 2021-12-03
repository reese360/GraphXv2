import { ShapeModel } from "@/common/models/shapes/Shape.model";
import { ToolInput } from "./../common/constants/enums/ToolInput.enum";
import { ShapeInput } from "./../common/constants/enums/ShapeInput.enum";
import { Action, Module, VuexModule } from "vuex-class-modules";
import * as boundsUtility from "@/utility/shapeBounds.utility";

@Module({ generateMutationSetters: true })
class GraphxModule extends VuexModule {
  private _selectedShape: ShapeInput = ShapeInput.LINE;
  private _activeTool: ToolInput = ToolInput.SELECT;
  private _activeStrokeColor = "#000";
  private _activeStrokeWidth = 1;
  private _activeFillColor = "none";

  private _shapeCollection: Map<string, ShapeModel> = new Map<
    string,
    ShapeModel
  >();

  get selectedShape(): ShapeInput {
    return this._selectedShape;
  }

  get activeTool(): ToolInput {
    return this._activeTool;
  }

  get shapeCollection(): Map<string, ShapeModel> {
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
    const a: ShapeModel = {
      id: "00000-00000-00000",
      name: "Rectangle-0",
      type: ShapeInput.RECTANGLE,
      selected: false,
      position: {
        x1: 50,
        y1: 50,
        x2: 200,
        y2: 200,
      },
      origin: { x: 50, y: 50 },
      properties: {
        strokeWidth: 10,
        fill: "#0ca",
        stroke: "#000",
      },
      getBounds: boundsUtility.getRectBounds,
    };
    this.addShape(a);

    const b: ShapeModel = {
      id: "00000-00000-00001",
      name: "Ellipse-1",
      type: ShapeInput.ELLIPSE,
      selected: false,
      position: {
        x1: 400,
        y1: 150,
        x2: 100,
        y2: 100,
      },
      origin: { x: 400, y: 150 },
      properties: {
        strokeWidth: 10,
        fill: "#9fe",
        stroke: "#000",
      },
      getBounds: boundsUtility.getEllipseBounds,
    };
    this.addShape(b);

    const c: ShapeModel = {
      id: "00000-00000-00002",
      type: ShapeInput.POLYGON,
      name: "Polygon-2",
      selected: false,
      position: [
        [669, 44],
        [558, 256],
        [781, 256],
      ],
      origin: [
        [669, 44],
        [558, 256],
        [781, 256],
      ],
      properties: {
        strokeWidth: 2,
        fill: "#09f",
        stroke: "#000",
      },
      getBounds: boundsUtility.getEllipseBounds,
    };
    this.addShape(c);
  }

  @Action updateShape(s: ShapeInput) {
    this._selectedShape = s;
  }

  @Action updateTool(t: ToolInput): void {
    this._activeTool = t;
  }

  @Action addShape(s: ShapeModel): void {
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

  lookupShape(id: string): ShapeModel | null {
    return this._shapeCollection.get(id) ?? null;
  }
}

import store from "./index";
export const graphxModule = new GraphxModule({ store, name: "graphx" });
