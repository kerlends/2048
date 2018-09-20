export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  id: string;
  value: number;
  parents: [string, string] | null;
}

export type Cell = Tile | null;

export type Row = Cell[];

export type Grid = Row[];

export interface State {
  readonly gameOver: boolean;
  readonly grid: Grid;
  readonly score: number;
  readonly size: number;
}
