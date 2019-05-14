import { getSdkEnvironment, SdkEnvironmentNames, sdkModules, createSdk } from '@archanova/sdk';

const {
  REACT_APP_SDK_ENV,
  REACT_APP_SDK_AUTO_INITIALIZE,
  REACT_APP_SDK_AUTO_ACCEPT_ACTION,
} = process.env;

let sdkEnv: sdkModules.Environment = getSdkEnvironment(SdkEnvironmentNames.Kovan);

if (REACT_APP_SDK_ENV) {
  sdkEnv = getSdkEnvironment(REACT_APP_SDK_ENV as SdkEnvironmentNames);
}

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
  });

export const sdk = createSdk(sdkEnv);

if (REACT_APP_SDK_AUTO_INITIALIZE) {
  sdk.initialize().catch(console.error);
}
