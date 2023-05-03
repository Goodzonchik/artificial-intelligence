export const vectorSize = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const res = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  if (isNaN(res)) {
    console.log('isNan', x1, y1, x2, y2);
  }
  return res;
};
