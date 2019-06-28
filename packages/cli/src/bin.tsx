#!/usr/bin/env node

import { createLocalSdkEnvironment, getSdkEnvironment, SdkEnvironmentNames, sdkModules } from '@archanova/sdk';
import { render } from 'ink';
import React from 'react';
import Ws from 'ws';
import config from './config';
import context from './context';
import { Main } from './Main';
import { SdkService, ServerService, StorageService, TemplateService } from './services';

let sdkEnv: sdkModules.Environment;

switch (config.env) {
  case SdkEnvironmentNames.Kovan:
  case SdkEnvironmentNames.Rinkeby:
  case SdkEnvironmentNames.Ropsten:
    sdkEnv = getSdkEnvironment(config.env);
    break;

  case 'local':
    sdkEnv = createLocalSdkEnvironment({
      ...config.localEnv,
    });
    break;
}

const storageService = new StorageService({
  namespace: sdkEnv.getConfig('storageOptions').namespace,
  localRootPath: config.localRootPath,
  globalRootPath: config.globalRootPath,
});

const sdkService = new SdkService(
  sdkEnv
    .setConfig('storageAdapter', storageService.toSdkAdapter())
    .setConfig('apiWebSocketConstructor', Ws),
);

const serverService = new ServerService();
const templateService = new TemplateService();

render(
  <context.Provider
    value={{
      config,
      sdkService,
      storageService,
      serverService,
      templateService,
    }}
  >
    <Main />
  </context.Provider>,
);
