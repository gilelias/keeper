import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import 'babel-polyfill';
import rootReducer from 'reducers';
import createHistory from 'history/createBrowserHistory'
import {Route, Switch} from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import App from 'components/App';

const isProduction = process.env.NODE_ENV === 'production';

// Creating store
let store = null;

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

if (isProduction) {
  // In production adding only thunk middleware
  const middleware = applyMiddleware(thunk, routerMiddleware(history));

  store = createStore(
    rootReducer,
    middleware
  );
} else {
  // In development mode beside thunk
  // logger and DevTools are added
  const middleware = applyMiddleware(thunk, routerMiddleware(history));
  let enhancer;

  // Enable DevTools if browser extension is installed
  if (window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-line
    enhancer = compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__() // eslint-disable-line
    );
  } else {
    enhancer = compose(middleware);
  }

  store = createStore(
    rootReducer,
    enhancer
  );
}


// Render it to DOM
ReactDOM.render(
  <Provider store={ store }>
    <ConnectedRouter history={history}>
        <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);