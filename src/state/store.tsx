import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import durationMiddleware from './durationMiddleware';
import persistMiddleware, {
  getPersistedState,
} from './persistMiddleware';

const DEVTOOLS_COMPOSE_NAMESPACE =
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const middleware = [thunk, durationMiddleware, persistMiddleware];

const composeEnhancers =
  DEVTOOLS_COMPOSE_NAMESPACE in window
    ? window[DEVTOOLS_COMPOSE_NAMESPACE]
    : compose;

const persistedState = getPersistedState();

const store = createStore(
  reducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middleware)),
);

export default store;
