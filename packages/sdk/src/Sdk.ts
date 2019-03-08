import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, Middleware } from 'redux';
import { IEnvironment } from './environment';
import {
  AccountService,
  AccountProviderService,
  AccountProxyService,
  ApiService,
  DeviceService,
  EthService,
  FaucetService,
  LinkingService,
  NotificationService,
  SecureService,
  SessionService,
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
import { IStorage } from './storage';
import { ISdk } from './interfaces';
import { reduxActions } from './redux';

export class Sdk implements ISdk {
  public readonly accountService: IAccountService;
  public readonly accountProviderService: IAccountProviderService;
  public readonly accountProxyService: IAccountProxyService;
  public readonly deviceService: IDeviceService;
  public readonly ethService: IEthService;
  public readonly faucetService: IFaucetService;
  public readonly linkingService: ILinkingService;
  public readonly notificationService: INotificationService;
  public readonly secureService: ISecureService;
  public readonly sessionService: ISessionService;

  constructor(environment: IEnvironment, storage: IStorage = null) {
    const apiService = new ApiService(environment.getServiceOptions('api'));

    this.deviceService = new DeviceService(storage);

    this.ethService = new EthService(
      environment.getServiceOptions('eth'),
      storage,
    );

    this.linkingService = new LinkingService(
      environment.getServiceOptions('linking'),
    );

    this.accountService = new AccountService(
      storage,
      apiService,
      this.deviceService,
      this.ethService,
      this.linkingService,
    );

    this.accountProviderService = new AccountProviderService(
      environment.getServiceOptions('accountProvider'),
      storage,
      apiService,
      this.accountService,
      this.ethService,
    );

    this.accountProxyService = new AccountProxyService(
      environment.getServiceOptions('accountProxy'),
      apiService,
      this.accountService,
      this.deviceService,
      this.ethService,
    );

    this.notificationService = new NotificationService(
      apiService,
      this.accountService,
      this.deviceService,
    );

    this.faucetService = new FaucetService(storage, apiService, this.accountService);

    this.secureService = new SecureService(
      apiService,
      this.deviceService,
      this.linkingService,
    );

    this.sessionService = new SessionService(
      apiService,
      this.deviceService,
    );
  }

  public async setup(): Promise<void> {
    await this.deviceService.setup();
    await this.ethService.setup();
    await this.sessionService.create();
    await this.accountService.setup();
    await this.accountProviderService.setup();
    await this.linkingService.setup();
    await this.notificationService.setup();
  }

  public async reset(): Promise<void> {
    await this.deviceService.reset();
    await this.sessionService.reset();
    this.accountService.reset();
  }

  public createReduxMiddleware(): Middleware {
    return (store: Store) => {
      setTimeout(
        () => {
          merge(
            this.accountService.account$.pipe(map(reduxActions.setAccount)),
            this.accountService.accountBalance$.pipe(map(reduxActions.setAccountBalance)),
            this.accountService.accountDevice$.pipe(map(reduxActions.setAccountDevice)),
            this.accountProviderService.supportedEnsName$.pipe(map(reduxActions.setSupportedEnsName)),
            this.deviceService.device$.pipe(map(reduxActions.setDevice)),
            this.ethService.networkVersion$.pipe(map(reduxActions.setNetworkVersion)),
            this.notificationService.connected$.pipe(map(reduxActions.setOnline)),
          )
            .subscribe(store.dispatch);
        },
        0,
      );

      return next => action => next(action);
    };
  }
}
