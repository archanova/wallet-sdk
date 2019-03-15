import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createSdk, availableEnvironments } from '@archanova/wallet-sdk';
import App from './App';
import reducers from './reducers';
import './index.scss';
import 'prismjs/themes/prism.css';

export let sdkEnv = availableEnvironments
  .development
  .extendOptions('action', {
    autoAccept: true,
  })
  .extendOptions('url', {
    listener: (callback) => callback(document.location.toString()),
  })
  .extendOptions('storage', {
    namespace: '@wallet',
    adapter: localStorage,
  });

// sdk env customizations for local development
if (process.env.REACT_APP_SDK_API_HOST) {
  const {
    REACT_APP_SDK_API_HOST,
    REACT_APP_SDK_API_PORT,
    REACT_APP_SDK_API_USE_SSL,
    REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
  } = process.env;

  sdkEnv = sdkEnv
    .extendOptions('api', {
      host: REACT_APP_SDK_API_HOST,
      port: parseInt(REACT_APP_SDK_API_PORT, 10),
      useSsl: !!REACT_APP_SDK_API_USE_SSL,
    })
    .extendOptions('eth', {
      providerEndpoint: REACT_APP_SDK_ETH_PROVIDER_ENDPOINT,
    });
}

// creates sdk instance
const sdk = new createSdk(sdkEnv);

if (process.env.REACT_APP_SDK_AUTO_INITIALIZE) {
  sdk.initialize().catch(console.error);
}

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(
    sdk.createReduxMiddleware(), // adds sdk redux middleware
    thunk.withExtraArgument(sdk),
  )),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
