import {
  flatten,
  pipe,
  groupBy,
  sortBy,
  pathOr,
  values,
  reverse as rev,
} from 'ramda';
import { ITile } from '../Tile';
import { Position } from '../../models';
import { Direction } from '../../enums';

const reverse = (tiles: ITile[]): ITile[] => rev(tiles);

export const copy = <T>(obj: T): T => {
  const str = JSON.stringify(obj);
  return JSON.parse(str);
};

export const sortVertically: (tiles: ITile[]) => ITile[] = pipe(
  sortBy(pathOr(0, ['position', 'y'])),
  groupBy(pathOr(0, ['position', 'x'])),
  values,
  flatten,
);

export const sortVerticallyReverse: (
  tiles: ITile[],
) => ITile[] = pipe(
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

export const getTileById = (tiles: ITile[], id: number): ITile => {
  const tile = tiles.filter((t) => t.id === id).pop();

  if (tile) return tile;

  throw new Error(`Tile with id '${id}' not found`);
};

export const getTileByPosition = (
  tiles: ITile[],
  pos: Position,
): ITile | void => {
  const filtered = tiles.filter(
    (t) => t.position.x === pos.x && t.position.y === pos.y,
  );

  if (filtered.length > 0) return filtered[0];
};

export const canTileMoveInDirection = (
  tile: ITile,
  dir: Direction,
) => {
  switch (dir) {
    case Direction.Up:
      return tile.position.y > 0;
    case Direction.Down:
      return tile.position.y < 3;
    case Direction.Left:
      return tile.position.x > 0;
    case Direction.Right:
      return tile.position.x < 3;
    default:
      return false;
  }
};

export const getTileAtPosition = (
  tiles: ITile[],
  pos: Position,
): ITile | void => {
  const filteredTiles = tiles.filter(
    (t) => t.position.x === pos.x && t.position.y === pos.y,
  );

  if (filteredTiles.length > 0) return filteredTiles[0];
};

export const moveTilesInDirection = (
  tiles: ITile[],
  dir: Direction,
): ITile[] => {
  return tiles;
};

export const updateTiles = (tiles: ITile[], tile: ITile) => {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].id === tile.id) tiles[i] = tile;
  }
};
