// React
import React from 'react';
import ReactDOM from 'react-dom';

// Service worker
import * as serviceWorker from 'serviceWorker';

// App
import App from './App';

//Redux
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux'
import rootReducer from 'reducer';

const store = createStore(rootReducer, applyMiddleware(thunk, logger))

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));

serviceWorker.unregister();
