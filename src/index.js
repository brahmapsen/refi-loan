import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';

import { ThemeProvider } from '@material-ui/core/styles';
import './index.css';
import { theme } from './theme';

ReactDOM.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    ,document.getElementById('root')
);
