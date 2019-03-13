import { IEnvironment, Environment, availableEnvironments } from './environment';
import { Api } from './api';
import {
  AccountProviderService,
  AccountProxyService,
  AccountService,
  ActionService,
  DeviceService,
  EventService,
  EthService,
  FaucetService,
  SecureService,
  SessionService,
  UrlService,
} from './services';
import { State } from './state';
import { IStorage } from './storage';
import { ISdk } from './interfaces';
import { Sdk } from './Sdk';

export function createSdk(
  options: {
    environment?: IEnvironment | 'development';
    storage?: IStorage;
  } = {},
): ISdk {
  let result: ISdk = null;
  let environment: IEnvironment = null;

  switch (options.environment) {
    case 'development':
      environment = availableEnvironments.development;
      break;

    default:
      if (options.environment instanceof Environment) {
        environment = options.environment;
      }
  }

  if (environment) {
    const api = new Api(environment.getOptions('api'));
    const storage = options.storage || null;
    const state = new State(storage);
    const accountService = new AccountService(api, state);
    const deviceService = new DeviceService(state, storage);
    const accountProviderService = new AccountProviderService(environment.getOptions('accountProvider'), api, state);
    const accountProxyService = new AccountProxyService(environment.getOptions('accountProxy'), api, state, deviceService);
    const actionService = new ActionService();
    const ethService = new EthService(environment.getOptions('eth'), state, storage);
    const eventService = new EventService(api, state);
    const faucetService = new FaucetService(api, state, storage);
    const secureService = new SecureService(api, state, deviceService);
    const sessionService = new SessionService(api, state, deviceService);
    const urlService = new UrlService(environment.getOptions('url'), actionService);

    result = new Sdk(
      state,
      accountService,
      accountProviderService,
      accountProxyService,
      actionService,
      deviceService,
      ethService,
      eventService,
      faucetService,
      secureService,
      sessionService,
      urlService,
    );
  }

  return result;
}
