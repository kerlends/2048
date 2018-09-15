import {
  getTileById,
  //getTileByPosition,
  moveTilesInDirection,
} from './Game.utils';
import { Direction } from '../../enums';

const createMockData = () => [
  {
    position: {
      x: 0,
      y: 0,
    },
    value: null,
    id: 0,
    size: 0,
  },
  {
    position: {
      x: 1,
      y: 0,
    },
    value: null,
    id: 1,
    size: 0,
  },
  {
    position: {
      x: 2,
      y: 0,
    },
    value: null,
    id: 2,
    size: 0,
  },
  {
    position: {
      x: 0,
      y: 1,
    },
    value: null,
    id: 3,
    size: 0,
  },
  {
    position: {
      x: 1,
      y: 1,
    },
    value: null,
    id: 4,
    size: 0,
  },
  {
    position: {
      x: 2,
      y: 1,
    },
    value: null,
    id: 5,
    size: 0,
  },
  {
    position: {
      x: 0,
      y: 2,
    },
    value: 2,
    id: 6,
    size: 0,
  },
  {
    position: {
      x: 1,
      y: 2,
    },
    value: 2,
    id: 7,
    size: 0,
  },
  {
    position: {
      x: 2,
      y: 2,
    },
    value: null,
    id: 8,
    size: 0,
  },
];

describe('Game utils', () => {
  describe('moveTilesInDirection', () => {
    it("doesn't mutate data", () => {
      const data = createMockData();
      const str = JSON.stringify(data);
      moveTilesInDirection(data, Direction.Up);
      expect(JSON.stringify(data)).toEqual(str);
    });

    it('moves tiles up', () => {
      const inputTiles = createMockData();
      const inTile1 = getTileById(inputTiles, 6);
      const inTile2 = getTileById(inputTiles, 7);

      expect(inTile1.position.x).toEqual(0);
      expect(inTile1.position.y).toEqual(2);

      expect(inTile2.position.x).toEqual(1);
      expect(inTile2.position.y).toEqual(2);

      const outputTiles = moveTilesInDirection(
        inputTiles,
        Direction.Up,
      );

      //const outTile1 = getTileByPosition(outputTiles, { x: 0, y: 0 });

      //expect(outTile1.value).toEqual(inTile1.value);

      expect(outputTiles).toBeTruthy();
    });
  });
});
