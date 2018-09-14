import { ITile } from '../Tile';
import { Position } from '../../models';
import { Direction } from '../../enums';

export const getTileById = (tiles: ITile[], id: number): ITile => {
  const tile = tiles.filter((t) => t.id === id).pop();

  if (tile) return tile;

  throw new Error(`Tile with id '${id}' not found`);
};

export const getTileByPosition = (
  tiles: ITile[],
  pos: Position,
): ITile => {
  const tile = tiles
    .filter((t) => t.position.x === pos.x && t.position.y === pos.y)
    .pop();

  if (tile) return tile;

  throw new Error(`Tile not found at position (${pos.x}, ${pos.y})`);
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
): ITile => {
  const filteredTiles = tiles.filter(
    (t) => t.position.x === pos.x && t.position.y === pos.y,
  );

  if (filteredTiles.length > 0) return filteredTiles[0];

  throw new Error(`Tile not found at (${pos.x}, ${pos.y})`);
};

export const moveTilesInDirection = (
  tiles: ITile[],
  dir: Direction,
): ITile[] => {
  return tiles;
};
