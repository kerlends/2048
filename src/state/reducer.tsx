import { AnyAction } from 'redux';
import { ActionTypes } from './enums';
import { State } from './models';
import { createTileInEmptyPosition, move, setupGrid } from './utils';

const initialState = {
  gameOver: false,
  grid: [],
  score: 0,
  size: 0,
};

const reducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.Initialize: {
      const { size, startingTiles } = action.payload;
      return {
        ...state,
        gameOver: false,
        grid: setupGrid(size, startingTiles),
        size,
        score: 0,
      };
    }

    case ActionTypes.Move: {
      const { direction } = action.payload;

      const { tiles, moved } = move({
        direction,
        tiles: state.grid,
        size: state.size,
      });

      if (moved && tiles.length < Math.pow(state.size, 2))
        tiles.push(createTileInEmptyPosition(tiles, state.size));

      return {
        ...state,
        grid: tiles,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
