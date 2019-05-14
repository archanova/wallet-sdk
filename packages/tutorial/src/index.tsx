import './index.scss';
import 'highlight.js/styles/atom-one-dark.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import reducers from './reducers';
import { configureSdk, configureStore } from './configure';
import { logger, context } from './shared';

const sdk = configureSdk(logger);
const store = configureStore(reducers, sdk);

render(
  <Provider store={store}>
    <context.Provider value={{
      sdk,
      logger,
    }}>
      <App />
    </context.Provider>
  </Provider>,
  document.getElementById('root'),
);
