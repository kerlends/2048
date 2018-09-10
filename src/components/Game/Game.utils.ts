import { ITile } from '../Tile';
import { Position } from '../../models';

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
