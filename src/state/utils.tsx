import {
  both,
  find,
  flatten,
  groupBy,
  pathEq,
  pathOr,
  pipe,
  reverse as rev,
  sortBy,
  values,
} from 'ramda';
import * as uuid from 'uuid/v4';
import { Position, Tile, TransformPositions } from './models';
import { Direction } from './enums';

const reverse = (tiles: Tile[]): Tile[] => rev(tiles);

export const sortVertically: (tiles: Tile[]) => Tile[] = pipe(
  sortBy(pathOr(0, ['position', 'y'])),
  groupBy(pathOr(0, ['position', 'x'])),
  values,
  flatten,
);

export const sortVerticallyReverse: (tiles: Tile[]) => Tile[] = pipe(
  sortBy(pathOr(0, ['position', 'y'])),
  reverse,
  groupBy(pathOr(0, ['position', 'x'])),
  values,
  flatten,
);

export const sortHorizontally = pipe(
  sortBy(pathOr(0, ['position', 'x'])),
  groupBy(pathOr(0, ['position', 'y'])),
  values,
  flatten,
);

export const sortHorizontallyReverse = pipe(
  sortBy(pathOr(0, ['position', 'x'])),
  reverse,
  groupBy(pathOr(0, ['position', 'y'])),
  values,
  flatten,
);

export const getSortedTiles = (
  tiles: Tile[],
  direction: Direction,
): Tile[] => {
  switch (direction) {
    case Direction.Up:
      return sortVertically(tiles);
    case Direction.Down:
      return sortVerticallyReverse(tiles);
    case Direction.Left:
      return sortHorizontally(tiles);
    case Direction.Right:
      return sortHorizontallyReverse(tiles);
    default:
      return tiles;
  }
};

export const arePositionsEqual = (
  positionA: Position,
  positionB: Position,
) => {
  const equal =
    positionA.x === positionB.x && positionA.y === positionB.y;

  console.clear();
  console.log(
    JSON.stringify({ positionA, positionB, equal }, null, 2),
  );
  return equal;
};

export const randomIntBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomPosition = (size: number): Position => ({
  x: randomIntBetween(0, size - 1),
  y: randomIntBetween(0, size - 1),
});

export const tileAtPosition = (
  tiles: Tile[],
  position: Position,
): Tile | null => {
  if (!tiles.length) return null;

  return (
    find(
      both(
        pathEq(['position', 'x'], position.x),
        pathEq(['position', 'y'], position.y),
      ),
      tiles,
    ) || null
  );
};

export const createTile = (position: Position): Tile => {
  const value = Math.random() < 0.9 ? 2 : 4;
  return {
    id: uuid(),
    position,
    value,
    mergedFrom: null,
  };
};

export const getEmptyPositions = (
  tiles: Tile[],
  size: number,
): Position[] => {
  const emptyPositions: Position[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pos = { x, y };
      if (!tileAtPosition(tiles, pos)) emptyPositions.push(pos);
    }
  }

  return emptyPositions;
};

export const getRandomEmptyPosition = (
  tiles: Tile[],
  size: number,
): Position => {
  const emptyPositions = getEmptyPositions(tiles, size);
  const index = Math.floor(Math.random() * emptyPositions.length);
  return emptyPositions[index];
};

interface IsPositionEmptyOptions {
  position: Position;
  size: number;
  tiles: Tile[];
}

export const isPositionEmpty = ({
  position,
  size,
  tiles,
}: IsPositionEmptyOptions) => {
  const emptyPositions = getEmptyPositions(tiles, size);
  return emptyPositions.some((pos) =>
    arePositionsEqual(pos, position),
  );
};

export const createTileInEmptyPosition = (
  tiles: Tile[],
  size: number,
) => {
  const position = getRandomEmptyPosition(tiles, size);
  return createTile(position);
};

export const setupGrid = (
  size: number,
  startingTiles: number,
): Tile[] => {
  let tiles: Tile[] = [];

  while (tiles.length < startingTiles) {
    const position = randomPosition(size);
    if (
      !tiles.some((tile) =>
        arePositionsEqual(tile.position, position),
      )
    ) {
      const tile = createTile(position);
      tiles.push(tile);
    }
  }

  return tiles;
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

interface TransformPositionsOptions {
  direction: Direction;
  position: Position;
  size: number;
  tiles: Tile[];
}

export const getTransformPositions = ({
  direction,
  position: startPosition,
  size,
  tiles,
}: TransformPositionsOptions): TransformPositions => {
  const vector = getVector(direction);

  let position: Position = Object.assign({}, startPosition);
  let previous: Position;

  do {
    previous = position;
    position = {
      x: position.x + vector.x,
      y: position.y + vector.y,
    };
  } while (
    position.x >= 0 &&
    position.x <= size &&
    position.y >= 0 &&
    position.y <= size &&
    isPositionEmpty({
      position,
      tiles,
      size,
    })
  );

  return {
    farthest: previous,
    next: position,
  };
};

interface MoveOptions {
  direction: Direction;
  size: number;
  tiles: Tile[];
}

export const move = ({
  direction,
  size,
  tiles: rawTiles,
}: MoveOptions): {
  tiles: Tile[];
  moved: boolean;
} => {
  const tiles = getSortedTiles(rawTiles, direction);
  const movedTiles: Tile[] = [];
  let moved = false;

  const fromPosition = (position: Position) =>
    //tileAtPosition(movedTiles, position) ||
    tileAtPosition(tiles, position);

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile) {
      const positions = getTransformPositions({
        direction,
        position: tile.position,
        size,
        tiles,
      });

      const nextTile = fromPosition(positions.next);

      let newTile: Tile;

      if (
        nextTile &&
        nextTile.value === tile.value &&
        !nextTile.mergedFrom
      ) {
        newTile = Object.assign({}, createTile(nextTile.position), {
          value: nextTile.value * 2,
          mergedFrom: [nextTile.id, tile.id],
        });
      } else {
        newTile = Object.assign({}, createTile(positions.farthest), {
          id: tile.id,
          value: tile.value,
        });
      }

      movedTiles.push(newTile);

      if (!arePositionsEqual(newTile.position, tile.position))
        moved = true;
    }
  }

  return {
    tiles: movedTiles,
    moved,
  };
};
