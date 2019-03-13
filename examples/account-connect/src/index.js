import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { availableEnvironments, createSdk, createReduxMiddleware } from '@archanova/wallet-sdk';
import './index.css';
import App from './App';
import reducers from './reducers';

const sdkStorage = null;
let sdkEnvironment = availableEnvironments.development;

// sdk env customizations for local development
if (process.env.REACT_APP_SDK_API_HOST) {
  const {
    REACT_APP_SDK_API_HOST,
    REACT_APP_SDK_API_PORT,
    REACT_APP_SDK_API_USE_SSL,
    REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
  } = process.env;

  sdkEnvironment = sdkEnvironment
    .extendOptions('api', {
      host: REACT_APP_SDK_API_HOST,
      port: parseInt(REACT_APP_SDK_API_PORT, 10),
      useSsl: !!REACT_APP_SDK_API_USE_SSL,
    })
    .extendOptions('eth', {
      providerEndpoint: REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
    });
}

const sdk = new createSdk({
  storage: sdkStorage,
  environment: sdkEnvironment,
});

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(
    createReduxMiddleware(sdk),
    thunk.withExtraArgument(sdk),
  )),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
