import { ShapeData } from "./../shapeData.type";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { ShapePosition } from "../shapePosition.type";
import { ShapeProperties } from "../ShapeProperties.type";
import BaseShape from "./base.shape";

export default class Ellipse extends BaseShape implements IShape {
  type = ShapeInput.ELLIPSE;
  position: ShapePosition;
  origin: { x: number; y: number };

  constructor(shapeData: ShapeData) {
    super(shapeData);
    this.position = shapeData.position as ShapePosition;
    this.origin = { x: this.position.x1, y: this.position.y1 };
  }

  get bounds(): ShapePosition {
    return {
      x1:
        this.position.x1 -
        this.position.x2 -
        Math.ceil(this.properties.strokeWidth / 2),
      y1:
        this.position.y1 -
        this.position.y2 -
        Math.ceil(this.properties.strokeWidth / 2),
      x2: this.position.x2 * 2 + this.properties.strokeWidth,
      y2: this.position.y2 * 2 + this.properties.strokeWidth,
    };
  }

  dragTo(pos: { x: number; y: number }) {
    this.position.x1 = this.origin.x + pos.x;
    this.position.y1 = this.origin.y + pos.y;
  }

  endDrag(): void {
    this.origin = { x: this.position.x1, y: this.position.y1 };
  }
}
