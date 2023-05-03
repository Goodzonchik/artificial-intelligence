import { Position } from '../rover';

export const vectorSize = (point1: Position, point2: Position): number => {
  const res = Math.sqrt(
    Math.pow(point2.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );

  return res;
};
