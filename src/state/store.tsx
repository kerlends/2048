import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { initialize } from './actions';

const DEVTOOLS_COMPOSE_NAMESPACE =
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const middleware = [thunk];

const composeEnhancers =
  DEVTOOLS_COMPOSE_NAMESPACE in window
    ? window[DEVTOOLS_COMPOSE_NAMESPACE]
    : compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware)),
);

store.dispatch(initialize());

export default store;
