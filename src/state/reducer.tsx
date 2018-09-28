import { AnyAction } from 'redux';
import { ActionTypes, GameStatus } from './enums';
import { State } from './models';
import {
  hasAvailableMoves,
  initializeWithStartingTiles,
  insertNewTileInUnusedCell,
  moveTiles,
} from './utils';

const initialState: State = {
  duration: 0,
  grid: [],
  hiScore: 0,
  score: 0,
  size: 0,
  startingTiles: 0,
  status: GameStatus.Initializing,
};

const reducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.Initialize: {
      if (state.status !== GameStatus.Initializing) return state;

      const { size, startingTiles } = action.payload;

      return {
        ...state,
        duration: 0,
        grid: initializeWithStartingTiles(size, startingTiles),
        score: 0,
        size,
        startingTiles,
        status: GameStatus.Running,
      };
    }

    case ActionTypes.Move: {
      if (state.status !== GameStatus.Running) return state;

      const { direction } = action.payload;

      const { moved, didMove, score } = moveTiles(
        state.grid,
        direction,
      );

      const { hiScore, ...rest } = state;

      const newScore = state.score + score;

      return {
        ...rest,
        grid: didMove ? insertNewTileInUnusedCell(moved) : moved,
        hiScore: hiScore >= newScore ? hiScore : newScore,
        score: newScore,
        status: hasAvailableMoves(moved)
          ? GameStatus.Running
          : GameStatus.Ended,
      };
    }

    case ActionTypes.Pause: {
      if (state.status === GameStatus.Running)
        return {
          ...state,
          status: GameStatus.Paused,
        };

      return state;
    }

    case ActionTypes.Resume: {
      if (state.status === GameStatus.Paused)
        return {
          ...state,
          status: GameStatus.Running,
        };

      return state;
    }

    case ActionTypes.Restart: {
      const { size, startingTiles } = state;
      return {
        ...state,
        duration: 0,
        grid: initializeWithStartingTiles(size, startingTiles),
        score: 0,
        status: GameStatus.Running,
      };
    }

    case ActionTypes.Tick: {
      if (state.status !== GameStatus.Running) return state;

      return {
        ...state,
        duration: state.duration + 1,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
