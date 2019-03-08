import { Middleware } from 'redux';
import {
  IAccountService,
  IAccountProviderService,
  IAccountProxyService,
  IDeviceService,
  IEthService,
  IFaucetService,
  ILinkingService,
  INotificationService,
  ISecureService,
  ISessionService,
} from './services';

export interface ISdk {
  readonly accountService: IAccountService;
  readonly accountProviderService: IAccountProviderService;
  readonly accountProxyService: IAccountProxyService;
  readonly deviceService: IDeviceService;
  readonly ethService: IEthService;
  readonly faucetService: IFaucetService;
  readonly linkingService: ILinkingService;
  readonly notificationService: INotificationService;
  readonly secureService: ISecureService;
  readonly sessionService: ISessionService;

  setup(): Promise<void>;

  reset(): Promise<void>;

  createReduxMiddleware(): Middleware;
}
