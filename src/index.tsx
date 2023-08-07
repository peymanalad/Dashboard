/* eslint-disable react/no-deprecated */
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import {ServiceWorker} from 'libs';
import 'App.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ServiceWorker />
  </React.StrictMode>,
  document.getElementById('root')
);
