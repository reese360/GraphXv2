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
  origin2: { x: number; y: number }; // track second

  constructor(shapeData: ShapeData) {
    super(shapeData);
    this.position = shapeData.position as ShapePosition;
    this.origin = { x: this.position.x1, y: this.position.y1 };
    this.origin2 = { x: this.position.x2, y: this.position.y2 };
  }

  get bounds(): ShapePosition {
    return {
      x1: this.position.x1,
      y1: this.position.y1,
      x2: this.position.x2 - this.position.x1,
      y2: this.position.y2 - this.position.y1,
    };
  }

  get outline(): string {
    return `<ellipse cx="${0} cy="${0}" rx="${10}" ry="${10}" stroke-width="1" stroke="#09f" fill="none"></ellipse>`;
  }

  async drawTo(pos: { x: number; y: number }) {
    this.position = {
      x1: this.origin!.x,
      y1: this.origin!.y,
      x2: pos.x,
      y2: pos.y,
    };
  }

  dragTo(pos: { x: number; y: number }) {
    this.position.x1 = this.origin.x + pos.x;
    this.position.y1 = this.origin.y + pos.y;
    this.position.x2 = this.origin2.x + pos.x;
    this.position.y2 = this.origin2.y + pos.y;
  }

  endDrag(): void {
    this.origin = { x: this.position.x1, y: this.position.y1 };
    this.origin2 = { x: this.position.x2, y: this.position.y2 };
  }
}
