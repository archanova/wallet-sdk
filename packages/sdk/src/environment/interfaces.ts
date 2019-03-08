import {
  IApiService,
  IAccountProviderService,
  IAccountProxyService,
  IEthService,
  ILinkingService,
} from '../services';

export interface IEnvironment {
  getServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
  ): IEnvironment.IServicesOptions[K];

  extendServiceOptions<K extends IEnvironment.TServiceKeys>(
    serviceKey: K,
    serviceOptions: Partial<IEnvironment.IServicesOptions[K]>,
  ): IEnvironment;
}

export namespace IEnvironment {
  export type TServiceKeys = keyof IServicesOptions;

  export interface IServicesOptions {
    api: IApiService.IOptions;
    accountProvider: IAccountProviderService.IOptions;
    accountProxy: IAccountProxyService.IOptions;
    eth: IEthService.IOptions;
    linking: ILinkingService.IOptions;
  }
}
