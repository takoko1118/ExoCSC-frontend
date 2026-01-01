
import React from 'react';

import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import { createTheme } from '@material-ui/core/styles'

// 🚀 在這裡注入修補程式，解決 "process is not defined" 錯誤
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  window.process = {
    env: { NODE_ENV: 'development' },
  };
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
