import { AnyAction } from 'redux';
import { ActionTypes } from './enums';
import { State } from './models';
import {
  hasAvailableMoves,
  initializeWithStartingTiles,
  insertNewTileInUnusedCell,
  moveTiles,
} from './utils';

const initialState = {
  gameOver: false,
  grid: [],
  score: 0,
  size: 0,
  startingTiles: 0,
};

const reducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.Initialize: {
      const { size, startingTiles } = action.payload;
      return {
        ...state,
        gameOver: false,
        grid: initializeWithStartingTiles(size, startingTiles),
        size,
        startingTiles,
        score: 0,
      };
    }

    case ActionTypes.Move: {
      const { direction } = action.payload;

      const { moved, didMove, score } = moveTiles(
        state.grid,
        direction,
      );

      return {
        ...state,
        gameOver: !hasAvailableMoves(moved),
        grid: didMove ? insertNewTileInUnusedCell(moved) : moved,
        score: state.score + score,
      };
    }

    case ActionTypes.Restart: {
      const { size, startingTiles } = state;
      return {
        ...state,
        gameOver: false,
        grid: initializeWithStartingTiles(size, startingTiles),
        score: 0,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
