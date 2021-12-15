import { ShapeData } from "./../shapeData.type";
import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { IShape } from "@/common/models/shapes/IShape.interface";
import { ShapePosition } from "../shapePosition.type";
import BaseShape from "./base.shape";

export default class Polygon extends BaseShape implements IShape {
  type = ShapeInput.POLYGON;
  position: [number, number][];
  origin: [number, number][];
  constructor(shapeData: ShapeData) {
    super(shapeData);
    this.position = shapeData.position as [number, number][];
    this.origin = JSON.parse(JSON.stringify(this.position));
    console.log(this.origin[0] === this.position[0]);
  }

  get bounds(): ShapePosition {
    const x = this.position.map((p) => p[0]);
    const y = this.position.map((p) => p[1]);
    const x1 = Math.min(...x) - Math.ceil(this.properties.strokeWidth / 2);
    const y1 = Math.min(...y) - Math.ceil(this.properties.strokeWidth / 2);

    return {
      x1: x1,
      y1: y1,
      x2: Math.max(...x) - x1 + this.properties.strokeWidth / 2,
      y2: Math.max(...y) - y1 + this.properties.strokeWidth / 2,
    };
  }

  get outline(): string {
    return `<polygon points="${this.position.join()}"stroke-width="1" stroke="#09f" fill="none"></polygon>`;
  }

  async drawTo(pos: { x: number; y: number }) {
    // const position   = {
    // 	x1: Math.min(this.origin!.x, pos.x),
    // 	y1: Math.min(this.origin!.y, pos.y),
    // 	x2: Math.max(pos.x, this.origin!.x),
    // 	y2: Math.max(pos.y, this.origin!.y),
    // };
  }

  dragTo(pos: { x: number; y: number }) {
    this.position.forEach((p, i) => {
      p[0] = this.origin[i][0] + pos.x;
      p[1] = this.origin[i][1] + pos.y;
    });
  }

  endDrag(): void {
    this.origin = JSON.parse(JSON.stringify(this.position));
  }
}
