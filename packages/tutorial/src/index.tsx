import React from 'react';
import { createReduxSdkMiddleware } from '@archanova/sdk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './index.scss';
import App from './App';
import { SdkProvider, sdk } from './sdk';
import reducers from './reducers';

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(
    createReduxSdkMiddleware(sdk),
  )),
);

render(
  <Provider store={store}>
    <SdkProvider sdk={sdk}>
      <App />
    </SdkProvider>
  </Provider>,
  document.getElementById('root'),
);
