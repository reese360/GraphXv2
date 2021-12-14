import { ShapeProperties } from "./../ShapeProperties.type";
import { ShapePosition } from "@/common/models/shapePosition.type";
import { ShapeInput } from "../../constants/enums/ShapeInput.enum";
export interface IShape {
  id: string;
  type: ShapeInput;
  name: string;
  position: ShapePosition | [number, number][];
  origin: { x: number; y: number } | [number, number][];
  selected: boolean;
  properties?: ShapeProperties;
  element?: HTMLElement;
  drawTo: (pos: { x: number; y: number }) => void;
  dragTo: (pos: { x: number; y: number }) => void;
  endDrag: () => void;
  bounds: ShapePosition;
  outline: string;
}
