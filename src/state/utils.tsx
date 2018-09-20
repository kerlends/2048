import * as uuidV4 from 'uuid/v4';
import { always, lensPath, over, pathOr, reverse } from 'ramda';
import { Direction } from './enums';
import { Cell, Grid, Position, Tile } from './models';

export const initialize = (size: number): Grid => {
  const grid: Grid = [];

  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++) {
      if (!grid[y]) grid[y] = [];
      grid[y][x] = null;
    }

  return grid;
};

export const createTile = (parent1?: Tile, parent2?: Tile): Tile => {
  if (parent1 && parent2) {
    return {
      id: uuidV4(),
      value: parent1.value * 2,
      parents: [parent1.id, parent2.id],
    };
  }

  const value = Math.random() < 0.9 ? 2 : 4;

  return {
    id: uuidV4(),
    value,
    parents: null,
  };
};

export const getCellAtPosition = (
  grid: Grid,
  { x, y }: Position,
): Cell => pathOr(null, [y, x], grid);

export const getTileAtPosition = (
  grid: Grid,
  position: Position,
): Tile => {
  const tile = getCellAtPosition(grid, position);

  if (!tile) {
    throw new Error(
      `Tile not found at position (${position.x}, ${position.y})`,
    );
  }

  return tile;
};

export const randomIntBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomPosition = (size: number): Position => ({
  x: randomIntBetween(0, size - 1),
  y: randomIntBetween(0, size - 1),
});

export const getEmptyPositions = (grid: Grid): Position[] => {
  const emptyPositions: Position[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const pos = { x, y };
      if (!getCellAtPosition(grid, pos)) emptyPositions.push(pos);
    }
  }

  return emptyPositions;
};

export const getRandomEmptyPosition = (grid: Grid): Position => {
  const emptyPositions = getEmptyPositions(grid);
  const index = Math.floor(Math.random() * emptyPositions.length);
  return emptyPositions[index];
};

export const positionsAreEqual = (a: Position, b: Position) =>
  a.x === b.x && a.y === b.y;

export const getPositionForTile = (
  grid: Grid,
  tile: Tile,
): Position => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const cell = getCellAtPosition(grid, { x, y });
      if (cell && cell.id === tile.id) return { x, y };
    }
  }

  throw new Error('Tile not found');
};

export const insertTileAtPosition = (
  grid: Grid,
  tile: Tile,
  pos: Position,
): Grid => over(lensPath([pos.y, pos.x]), always(tile), grid);

export const insertNewTileInUnusedCell = (grid: Grid): Grid => {
  const pos = getRandomEmptyPosition(grid);
  return insertTileAtPosition(grid, createTile(), pos);
};

export const initializeWithStartingTiles = (
  size: number,
  starting: number,
): Grid => {
  let grid = initialize(size);
  for (let i = 0; i < starting - 1; i++) {
    grid = insertNewTileInUnusedCell(grid);
  }
  return grid;
};

export const getVector = (direction: Direction): Position => {
  switch (direction) {
    case Direction.Up: {
      return { x: 0, y: -1 };
    }
    case Direction.Down: {
      return { x: 0, y: 1 };
    }
    case Direction.Left: {
      return { x: -1, y: 0 };
    }
    case Direction.Right: {
      return { x: 1, y: 0 };
    }
    default: {
      return { x: 0, y: 0 };
    }
  }
};

export const isAvailableCell = (grid: Grid, pos: Position) =>
  !getCellAtPosition(grid, pos);

export const getNextTilePositions = (
  grid: Grid,
  tile: Tile,
  dir: Direction,
): {
  furthest: Position;
  next: Position;
} => {
  const vector = getVector(dir);
  const pos = getPositionForTile(grid, tile);
  let position: Position = Object.assign({}, pos);
  let previous: Position = pos;

  do {
    previous = position;
    position = {
      x: position.x + vector.x,
      y: position.y + vector.y,
    };
  } while (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < grid.length &&
    position.y < grid.length &&
    isAvailableCell(grid, position)
  );

  return {
    furthest: previous,
    next: position,
  };
};

export const flattenGrid = (grid: Grid): Cell[] => {
  const flattened = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      flattened.push(getCellAtPosition(grid, { x, y }));
    }
  }

  return flattened;
};

export const getDirectionTraversals = (
  grid: Grid,
  direction: Direction,
): {
  x: number[];
  y: number[];
} => {
  let x = [];
  let y = [];

  for (let t = 0; t < grid.length; t++) {
    x.push(t);
    y.push(t);
  }

  const vector = getVector(direction);

  if (vector.x === 1) x = reverse(x);
  if (vector.y === 1) y = reverse(y);

  return { x, y };
};

export const moveTiles = (grid: Grid, direction: Direction) => {
  const moved: Grid = grid.map((row) =>
    row.map((cell) => {
      if (!cell) return null;
      return {
        ...cell,
        parents: null,
      };
    }),
  );

  let didMove = false;
  let score = 0;

  const insert = (tile: Tile, { x, y }: Position) => {
    moved[y][x] = tile;
  };

  const remove = ({ x, y }: Position) => {
    moved[y][x] = null;
  };

  const traversals = getDirectionTraversals(moved, direction);

  traversals.x.forEach((x) => {
    traversals.y.forEach((y) => {
      const pos = { x, y };

      const cell = getCellAtPosition(moved, pos);

      if (cell) {
        const positions = getNextTilePositions(
          moved,
          cell,
          direction,
        );

        const next = getCellAtPosition(moved, positions.next);

        if (next && next.value === cell.value && !next.parents) {
          const newTile = createTile(next, cell);
          insert(newTile, positions.next);
          remove(pos);
          didMove = true;
          score += newTile.value;
        } else if (!positionsAreEqual(pos, positions.furthest)) {
          insert(cell, positions.furthest);
          remove(pos);
          didMove = true;
        }
      }
    });
  });

  return {
    moved,
    didMove,
    score,
  };
};
