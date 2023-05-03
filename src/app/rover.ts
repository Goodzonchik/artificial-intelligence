export type Position = { x: number; y: number };

export type Rover = {
  id: number;
  position: Position;
  endPosition: Position;
  action: 'move' | 'mining' | 'upload' | 'wait' | 'search';
  payload: number;
};
