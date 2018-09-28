import { Middleware } from 'redux';
import { ActionTypes, GameStatus } from './enums';

const durationMiddleware: Middleware = (store) => {
  let tickInterval: any;

  const tick = () =>
    store.dispatch({
      type: ActionTypes.Tick,
    });

  return (next) => (action) => {
    next(action);

    if (
      action.type === ActionTypes.Initialize ||
      action.type === ActionTypes.Resume
    )
      tickInterval = setInterval(tick, 1000);
    else if (action.type === ActionTypes.Pause)
      clearInterval(tickInterval);
    else if (action.type === ActionTypes.Move) {
      const state = store.getState();
      if (state.status === GameStatus.Ended)
        clearInterval(tickInterval);
    } else if (action.type === ActionTypes.Restart) {
      clearInterval(tickInterval);
      tickInterval = setInterval(tick, 1000);
    }
  };
};

export default durationMiddleware;
