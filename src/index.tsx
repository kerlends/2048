import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const renderElement = document.getElementById('root') as HTMLElement;

const root = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(root, renderElement);
registerServiceWorker();
