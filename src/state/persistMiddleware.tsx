import { Middleware } from 'redux';
import { ActionTypes } from './enums';

const key = '@@2048/cache';

export const getPersistedState = () => {
  const state = localStorage.getItem(key);
  return state ? JSON.parse(state) : undefined;
};

const persistMiddleware: Middleware = (store) => (next) => (
  action,
) => {
  next(action);

  switch (action.type) {
    case ActionTypes.Move:
    case ActionTypes.Restart:
      const state = store.getState();
      localStorage.setItem(key, JSON.stringify(state));
      break;
    default:
      break;
  }
};

export default persistMiddleware;
