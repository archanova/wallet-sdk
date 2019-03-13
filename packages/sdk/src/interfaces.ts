import { IBN } from 'bn.js';
import { IState } from './state';
import {
  IAccountService,
  IAccountProviderService,
  IAccountProxyService,
  IActionService,
  IDeviceService,
  IEthService,
  IEventService,
  IFaucetService,
  ISecureService,
  ISessionService,
  IUrlService,
  IAccount,
} from './services';

export interface ISdk {
  readonly state: IState;
  readonly accountService: IAccountService;
  readonly accountProviderService: IAccountProviderService;
  readonly accountProxyService: IAccountProxyService;
  readonly actionService: IActionService;
  readonly deviceService: IDeviceService;
  readonly ethService: IEthService;
  readonly eventService: IEventService;
  readonly faucetService: IFaucetService;
  readonly secureService: ISecureService;
  readonly sessionService: ISessionService;
  readonly urlService: IUrlService;

  setup(): Promise<void>;

  reset(): Promise<void>;

  getGasPrice(): Promise<IBN>;

  createAccount(ensName?: string): Promise<boolean>;

  connectAccount(accountAddress: string): Promise<boolean>;

  getAccounts(): Promise<IAccount[]>;

  createRequestAddAccountDeviceUrl(options?: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string }): string;
}
