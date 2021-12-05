import { ShapeData } from "./../shapeData.type";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { ShapeProperties } from "../ShapeProperties.type";
import BaseShape from "./base.shape";
import { ShapePosition } from "../shapePosition.type";

export default class Line extends BaseShape implements IShape {
  type = ShapeInput.LINE;
  position: ShapePosition;
  origin: { x: number; y: number };

  constructor(shapeData: ShapeData) {
    super(shapeData);
    this.position = shapeData.position as ShapePosition;
    this.origin = { x: this.position.x1, y: this.position.y1 };
  }

  get bounds(): ShapePosition {
    return {
      x1: this.position.x1,
      y1: this.position.y1,
      x2: this.position.x2 - this.position.x1,
      y2: this.position.y2 - this.position.y1,
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
