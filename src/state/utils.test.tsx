import {
  createTile,
  getNextTilePositions,
  getPositionForTile,
  getTileAtPosition,
  getCellAtPosition,
  initialize,
  insertTileAtPosition,
  isAvailableCell,
  moveTiles,
} from './utils';

import { Direction } from './enums';

describe('initialize', () => {
  it('creates a nil grid of rows and columns of a specified size', () => {
    const grid = initialize(3);

    expect(grid).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });
});

describe('insertTileAtPosition', () => {
  it('inserts a new tile at a passed position into the passed grid', () => {
    const grid = initialize(3);
    const tile = createTile();
    expect(insertTileAtPosition(grid, tile, { x: 1, y: 1 })).toEqual([
      [null, null, null],
      [null, tile, null],
      [null, null, null],
    ]);
  });
});

describe('getPositionForTile', () => {
  it('returns the position of a passed tile', () => {
    const tile = createTile();
    const grid = [
      [null, null, null],
      [null, null, null],
      [null, tile, null],
    ];

    const position = getPositionForTile(grid, tile);

    expect(position).toEqual({
      x: 1,
      y: 2,
    });
  });
});

describe('isAvailableCell', () => {
  const tile1 = createTile();
  const tile2 = createTile();
  const tile3 = createTile();
  const grid = [
    [tile1, null, null],
    [null, null, null],
    [tile2, null, tile3],
  ];

  it('returns false when a cell has a tile', () => {
    expect(isAvailableCell(grid, { x: 0, y: 0 })).toBe(false);
    expect(isAvailableCell(grid, { x: 0, y: 2 })).toBe(false);
    expect(isAvailableCell(grid, { x: 2, y: 2 })).toBe(false);
  });

  it('returns true when a cell is empty', () => {
    expect(isAvailableCell(grid, { x: 1, y: 0 })).toBe(true);
    expect(isAvailableCell(grid, { x: 2, y: 0 })).toBe(true);
    expect(isAvailableCell(grid, { x: 0, y: 1 })).toBe(true);
    expect(isAvailableCell(grid, { x: 1, y: 1 })).toBe(true);
    expect(isAvailableCell(grid, { x: 2, y: 1 })).toBe(true);
    expect(isAvailableCell(grid, { x: 1, y: 2 })).toBe(true);
  });
});

describe('getNextTilePositions', () => {
  it('returns available positions for directions', () => {
    const tile1 = createTile();
    const tile2 = createTile();
    const tile3 = createTile();
    let grid = [
      [tile1, null, null],
      [null, null, null],
      [tile2, null, tile3],
    ];

    const positions1 = getNextTilePositions(
      grid,
      tile1,
      Direction.Right,
    );
    expect(positions1.furthest).toEqual({
      x: 2,
      y: 0,
    });

    const positions2 = getNextTilePositions(
      grid,
      tile2,
      Direction.Right,
    );
    expect(positions2.furthest).toEqual({
      x: 1,
      y: 2,
    });
    expect(positions2.next).toEqual({
      x: 2,
      y: 2,
    });

    const positions3 = getNextTilePositions(
      grid,
      tile1,
      Direction.Up,
    );
    expect(positions3.furthest).toEqual({
      x: 0,
      y: 0,
    });

    const positions4 = getNextTilePositions(
      grid,
      tile3,
      Direction.Up,
    );
    expect(positions4.furthest).toEqual({
      x: 2,
      y: 0,
    });
  });
});

describe('moveTiles', () => {
  it('moves tiles up', () => {
    const tile1 = createTile();
    const tile2 = createTile();
    const tile3 = createTile();

    tile1.value = 2;
    tile2.value = 2;

    const tile5 = createTile();
    const tile6 = createTile();
    const tile7 = createTile();

    tile5.value = 8;
    tile6.value = 4;
    tile7.value = 2;

    const grid = [
      [tile1, tile5, null],
      [tile7, null, null],
      [tile2, tile6, tile3],
    ];

    const { moved } = moveTiles(grid, Direction.Up);
    const tile4 = getTileAtPosition(moved, { x: 0, y: 0 });
    expect(tile4.parents).toEqual([tile1.id, tile7.id]);

    expect(moved).toEqual([
      [tile4, tile5, tile3],
      [tile2, tile6, null],
      [null, null, null],
    ]);
  });

  it('moves tiles down', () => {
    const tile1 = createTile();
    const tile2 = createTile();
    const tile3 = createTile();
    const tile5 = createTile();

    tile1.value = 2;
    tile2.value = 2;
    tile5.value = 2;

    const grid = [
      [tile1, null, null],
      [tile5, null, null],
      [tile2, null, tile3],
    ];

    const { moved } = moveTiles(grid, Direction.Down);

    const tile4 = getCellAtPosition(moved, { x: 0, y: 2 });

    // expect(tile4.parents).toEqual([tile2.id, tile5.id]);

    // printGrid(grid);
    // printGrid(moved);
    expect(moved).toEqual([
      [null, null, null],
      [tile1, null, null],
      [tile4, null, tile3],
    ]);
  });

  it('moves tiles left', () => {
    const tile1 = createTile();
    const tile2 = createTile();
    const tile3 = createTile();

    tile2.value = 4;
    tile3.value = 4;

    const grid = [
      [tile1, null, null],
      [null, null, null],
      [tile2, null, tile3],
    ];

    const { moved } = moveTiles(grid, Direction.Left);

    const tile4 = getTileAtPosition(moved, { x: 0, y: 2 });
    expect(tile4.parents).toEqual([tile2.id, tile3.id]);

    expect(moved).toEqual([
      [tile1, null, null],
      [null, null, null],
      [tile4, null, null],
    ]);
  });

  it('moves tiles right', () => {
    const tile1 = createTile();
    const tile2 = createTile();
    const tile3 = createTile();

    tile2.value = 4;
    tile3.value = 4;

    const grid = [
      [tile1, null, null],
      [null, null, null],
      [tile2, null, tile3],
    ];

    const { moved } = moveTiles(grid, Direction.Right);

    const tile4 = getTileAtPosition(moved, { x: 2, y: 2 });

    expect(tile4.parents).toEqual([tile3.id, tile2.id]);

    expect(moved).toEqual([
      [null, null, tile1],
      [null, null, null],
      [null, null, tile4],
    ]);
  });

  it('returns a didMove flag of true when tiles moved', () => {
    const tile1 = createTile();
    const tile2 = createTile();

    const grid = [
      [null, null, null],
      [tile1, null, null],
      [null, tile2, null],
    ];

    expect(moveTiles(grid, Direction.Up).didMove).toEqual(true);
  });

  it('returns a didMove flag of false when tiles did not move', () => {
    const tile1 = createTile();
    const tile2 = createTile();

    const grid = [
      [null, null, null],
      [null, null, null],
      [tile1, tile2, null],
    ];

    expect(moveTiles(grid, Direction.Down).didMove).toEqual(false);
  });
});
