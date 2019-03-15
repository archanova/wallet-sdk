import { IBN } from 'bn.js';
import { Middleware } from 'redux';
import { IState } from './state';
import { IAccount, IFaucetService } from './services';

export interface ISdk {
  readonly state: IState;

  initialize(): Promise<void>;

  reset(options?: { device?: boolean, session?: boolean }): void;

  getGasPrice(): Promise<IBN>;

  getNetworkVersion(): Promise<string>;

  createAccount(ensName?: string): Promise<IAccount>;

  connectAccount(accountAddress: string): Promise<IAccount>;

  getAccounts(): Promise<IAccount[]>;

  topUpAccount(): Promise<IFaucetService.IReceipt>;

  createRequestAddAccountDeviceUrl(options?: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string }): string;

  createReduxMiddleware(): Middleware;
}
