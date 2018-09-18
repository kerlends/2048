export interface Position {
  x: number;
  y: number;
}

export interface TransformPositions {
  farthest: Position;
  next: Position;
}

export interface Tile {
  id: string;
  position: Position;
  value: number;
  mergedFrom: [string, string] | null;
}

export interface State {
  readonly gameOver: boolean;
  readonly grid: Tile[];
  readonly score: number;
  readonly size: number;
}
