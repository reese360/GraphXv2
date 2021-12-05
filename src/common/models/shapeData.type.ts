import { ShapePosition } from "./shapePosition.type";
import { ShapeProperties } from "./ShapeProperties.type";

export type ShapeData = {
  name: string;
  position: ShapePosition | [number, number][];
  properties: ShapeProperties;
};
