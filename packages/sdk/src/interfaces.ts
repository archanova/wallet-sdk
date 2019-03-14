import { IBN } from 'bn.js';
import { IState } from './state';
import {
  IAccountService,
  IAccountProviderService,
  IAccountProxyService,
  IActionService,
  IApiService,
  IDeviceService,
  IEthService,
  IEventService,
  IFaucetService,
  ISecureService,
  ISessionService,
  IStorageService,
  IUrlService,
  IAccount,
} from './services';

export interface ISdk {
  readonly state: IState;
  readonly accountService: IAccountService;
  readonly accountProviderService: IAccountProviderService;
  readonly accountProxyService: IAccountProxyService;
  readonly actionService: IActionService;
  readonly apiService: IApiService;
  readonly deviceService: IDeviceService;
  readonly ethService: IEthService;
  readonly eventService: IEventService;
  readonly faucetService: IFaucetService;
  readonly secureService: ISecureService;
  readonly sessionService: ISessionService;
  readonly storageService: IStorageService;
  readonly urlService: IUrlService;

  initialize(): Promise<void>;

  getGasPrice(): Promise<IBN>;

  createAccount(ensName?: string): Promise<boolean>;

  connectAccount(accountAddress: string): Promise<boolean>;

  getAccounts(): Promise<IAccount[]>;

  createRequestAddAccountDeviceUrl(options?: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string }): string;
}
