import { ShapeInput } from "@/common/constants/enums/ShapeInput.enum";
import { v4 as uuidv4 } from "uuid";
import { ShapeData } from "../shapeData.type";
import { ShapePosition } from "../shapePosition.type";
import { ShapeProperties } from "../ShapeProperties.type";

export default class BaseShape {
  id: string;
  name: string;
  properties: ShapeProperties;
  element!: HTMLElement;
  selected = false;
  constructor(shapeData: ShapeData) {
    this.id = uuidv4();
    this.name = shapeData.name;
    this.properties = shapeData.properties;
  }
}
