import { ShapePosition } from "@/common/models/shapes/shapePosition.model";
import { ShapeInput } from "../../constants/enums/ShapeInput.enum";
export interface ShapeModel {
  id: string;
  type: ShapeInput;
  name?: string;
  position: ShapePosition | [number, number][];
  origin: { x: number; y: number } | [number, number][];
  selected: boolean;
  properties?: {
    strokeWidth: number;
    fill: string;
    stroke: string;
  };

  element?: HTMLElement;
  getBounds: (position: ShapePosition, sWidth: number) => ShapePosition;
}
