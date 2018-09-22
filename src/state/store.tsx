import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import persistMiddleware, {
  getPersistedState,
} from './persistMiddleware';
import { initialize } from './actions';

const DEVTOOLS_COMPOSE_NAMESPACE =
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const middleware = [thunk, persistMiddleware];

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

if (!persistedState) store.dispatch(initialize());

export default store;
