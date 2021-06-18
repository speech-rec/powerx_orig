import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import * as serviceWorker from './serviceWorker';
import './index.css';

import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
     <PersistGate persistor={persistor}>
     <App />
     </PersistGate>
  </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
// "heroku-postbuild": "npm install && npm install --only=dev --no-shrinkwrap && npm run build"
//"proxy": "http://localhost:8080"