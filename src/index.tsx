import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import {ServiceWorker} from 'libs';
import 'App.css';

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <App />
    <ServiceWorker />
  </React.StrictMode>,
  document.getElementById('root')
);
