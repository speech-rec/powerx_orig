import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import { Button, SnackbarContent, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import * as serviceWorker from './serviceWorker';
import './index.css';

import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
     <PersistGate persistor={persistor}>
     <SnackbarContent
   id="refresh-bar"
   className="refresh_bar"
   style={{display: 'none'}}
   message={
       <Button id="refresh_btn" key="install" aria-label="close" color="inherit"
               className="refresh_bar_class" onClick={() => {
                 
               }}>
           New Content available. Please restart the application!
       </Button>
   }
   action={[
       <IconButton key="close" aria-label="close" color="inherit" onClick={() => {
        let infoBar = document.querySelector("#refresh-bar");
        if(infoBar) {
            infoBar.style.display = 'none';
        }
       }}>
           
           <FontAwesomeIcon icon={faTimes} fontSize="small"/>
       </IconButton>
   ]}
/>
     <App />
     </PersistGate>
  </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register({ onUpdate: (registration) => {
  let refreshBar = document.querySelector('#custom-refresh-bar');
  if(refreshBar) {
      refreshBar.style.display = '';
  }}});

  document.onvisibilitychange = (e) => {
    let refreshBar = document.querySelector('#refresh-bar');
    if(refreshBar && !document.hidden) {
        serviceWorker.forceSWupdate();
    }
 }
// "heroku-postbuild": "npm install && npm install --only=dev --no-shrinkwrap && npm run build"
//"proxy": "http://localhost:8080"