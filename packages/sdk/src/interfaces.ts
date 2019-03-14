import { Middleware } from 'redux';
import { IState } from './state';
import { IAccount } from './services';

export interface ISdk {
  readonly state: IState;

  initialize(): Promise<void>;

  reset(): void;

  createAccount(ensName?: string): Promise<IAccount>;

  connectAccount(accountAddress: string): Promise<IAccount>;

  getAccounts(): Promise<IAccount[]>;

  createRequestAddAccountDeviceUrl(options?: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string }): string;

  createReduxMiddleware(): Middleware;
}
