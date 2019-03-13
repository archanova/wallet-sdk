import { IApi } from '../api';
import {
  IAccountProviderService,
  IAccountProxyService,
  IEthService,
  IUrlService,
} from '../services';

export interface IEnvironment {
  getOptions<K extends IEnvironment.TKeys>(
    key: K,
  ): IEnvironment.IOptions[K];

  extendOptions<K extends IEnvironment.TKeys>(
    key: K,
    options: Partial<IEnvironment.IOptions[K]>,
  ): IEnvironment;
}

export namespace IEnvironment {
  export type TKeys = keyof IOptions;

  export interface IOptions {
    api: IApi.IOptions;
    accountProvider: IAccountProviderService.IOptions;
    accountProxy: IAccountProxyService.IOptions;
    eth: IEthService.IOptions;
    url: IUrlService.IOptions;
  }
}
