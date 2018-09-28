import { ActionTypes, Direction } from './enums';

export const start = (
  size: number = 3,
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

export const pause = () => ({
  type: ActionTypes.Pause,
});

export const resume = () => ({
  type: ActionTypes.Resume,
});

export const restart = () => ({
  type: ActionTypes.Restart,
});
