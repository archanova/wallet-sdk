import {
  getSdkEnvironment,
  SdkEnvironmentNames,
  createLocalSdkEnvironment,
  sdkModules,
  createSdk,
  Sdk,
  createReduxSdkMiddleware,
} from '@archanova/sdk';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ILogger } from './shared';

const {
  REACT_APP_SDK_ENV,
  REACT_APP_SDK_LOCAL_ENV_HOST,
  REACT_APP_SDK_AUTO_INITIALIZE,
  REACT_APP_SDK_AUTO_ACCEPT_ACTION,
} = process.env;

export function configureSdk(logger: ILogger): Sdk {
  let sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Kovan); // kovan env by default

  switch (REACT_APP_SDK_ENV) {
    case SdkEnvironmentNames.Rinkeby:
    case SdkEnvironmentNames.Ropsten:
    case SdkEnvironmentNames.Kovan:
      sdkEnv = getSdkEnvironment(REACT_APP_SDK_ENV as SdkEnvironmentNames);
      break;

    case 'local':
      sdkEnv = createLocalSdkEnvironment(REACT_APP_SDK_LOCAL_ENV_HOST || 'localhost');
      break;
  }

  const sdk = createSdk(
    sdkEnv
      .setConfig('storageAdapter', localStorage as sdkModules.Storage.IAdapter)
      .setConfig('urlAdapter', {
        open(url: string): any {
          document.location = url as any;
        },
        addListener(listener: (url: string) => any): void {
          listener(document.location.toString());
        },
      })
      .extendConfig('actionOptions', {
        autoAccept: !!REACT_APP_SDK_AUTO_ACCEPT_ACTION,
      }),
  );

  if (REACT_APP_SDK_AUTO_INITIALIZE) {
    sdk
      .initialize()
      .catch(err => logger.error(err));
  }

  return sdk;
}

export function configureStore(reducers: any, sdk: Sdk): Store<any> {
  return createStore(
    reducers,
    {},
    composeWithDevTools(applyMiddleware(
      createReduxSdkMiddleware(sdk),
    )),
  );
}
