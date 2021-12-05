import { ShapePosition } from "@/common/models/shapePosition.type";

const getRectBounds = (position: ShapePosition, sWidth: number) => {
  return {
    x1: (position as ShapePosition).x1 - Math.ceil(sWidth / 2),
    y1: (position as ShapePosition).y1 - Math.ceil(sWidth / 2),
    x2: (position as ShapePosition).x2 + sWidth,
    y2: (position as ShapePosition).y2 + sWidth,
  };
};

const getEllipseBounds = (position: ShapePosition, sWidth: number) => {
  return {
    x1:
      (position as ShapePosition).x1 -
      (position as ShapePosition).x2 -
      Math.ceil(sWidth / 2),
    y1:
      (position as ShapePosition).y1 -
      (position as ShapePosition).y2 -
      Math.ceil(sWidth / 2),
    x2: (position as ShapePosition).x2 * 2 + sWidth,
    y2: (position as ShapePosition).y2 * 2 + sWidth,
  };
};

const getLineBounds = (position: ShapePosition, sWidth: number) => {
  return {
    x1: (position as ShapePosition).x1,
    y1: (position as ShapePosition).y1,
    x2: (position as ShapePosition).x2 - (position as ShapePosition).x1,
    y2: (position as ShapePosition).y2 - (position as ShapePosition).y1,
  };
};

const getPolyBounds = () => {
  return {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };
};

export { getRectBounds, getEllipseBounds, getLineBounds, getPolyBounds };
