import { ActionTypes, Direction } from './enums';

export const initialize = (
  size: number = 4,
  startingTiles: number = 2,
) => ({
  type: ActionTypes.Initialize,
  payload: {
    size,
    startingTiles,
  },
});

export const move = (direction: Direction) => ({
  type: ActionTypes.Move,
  payload: {
    direction,
  },
});

export const restart = () => ({
  type: ActionTypes.Restart,
});
