import { Middleware, Store } from 'redux';
import { from, merge, of, timer } from 'rxjs';
import { switchMap, filter, takeUntil, map } from 'rxjs/operators';
import { ISdk } from './interfaces';
import { ReduxActionTypes } from './redux';
import {
  IAccount,
  IAccountProviderService,
  IAccountProxyService,
  IAccountService,
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
  ActionTypes,
  actionPayload,
} from './services';
import { IState } from './state';

/**
 * Sdk
 */
export class Sdk implements ISdk {

  constructor(
    public readonly state: IState,
    private readonly accountService: IAccountService,
    private readonly accountProviderService: IAccountProviderService,
    private readonly accountProxyService: IAccountProxyService,
    private readonly actionService: IActionService,
    private readonly apiService: IApiService,
    private readonly deviceService: IDeviceService,
    private readonly ethService: IEthService,
    private readonly eventService: IEventService,
    private readonly faucetService: IFaucetService,
    private readonly secureService: ISecureService,
    private readonly sessionService: ISessionService,
    private readonly storageService: IStorageService,
    private readonly urlService: IUrlService,
  ) {
    //
  }

  public async initialize(): Promise<void> {
    this.require({
      notInitialized: true,
    });

    const { initialized$, connected$, authenticated$, deviceAddress$ } = this.state;
    const deviceAddress = await this.deviceService.setup();

    deviceAddress$.next(deviceAddress);

    await this.state.setup();
    this.actionService.setup();

    if (await this.sessionService.createSession(deviceAddress)) {
      authenticated$.next(true);

      this.eventService.setup().subscribe(connected$);

      this.urlService.setup();

      this.subscribeAccountBalance();

      initialized$.next(true);
    }
  }

  public reset(): void {
    this.require();

    this.state.reset();
  }

  public async createAccount(ensName: string = null): Promise<IAccount> {
    this.require({
      disconnectedAccount: true,
    });

    const account = await this.accountProviderService.createAccount(ensName);

    return this.verifyAccount(account);
  }

  public async connectAccount(accountAddress: string): Promise<IAccount> {
    this.require({
      disconnectedAccount: true,
    });

    const account = await this.accountService.getAccount(accountAddress);

    return this.verifyAccount(account);
  }

  public async getAccounts(): Promise<IAccount[]> {
    this.require();

    return this.accountService.getAccounts();
  }

  public createRequestAddAccountDeviceUrl(options: { accountAddress?: string, endpoint?: string, callbackEndpoint?: string } = {}): string {
    this.require({
      disconnectedAccount: true,
    });

    const { deviceAddress } = this.state;
    const action = this.actionService.createAction<actionPayload.IRequestAddAccountDevice>(
      ActionTypes.RequestAddAccountDevice,
      {
        deviceAddress,
        accountAddress: options.accountAddress || null,
        callbackEndpoint: options.callbackEndpoint || null,
      },
    );

    return this.urlService.buildActionUrl(action, options.endpoint || null);
  }

  public createReduxMiddleware(): Middleware {
    const createActionCreator = (type: ReduxActionTypes) => (payload: any) => ({
      type,
      payload,
    });

    return (store: Store) => {
      setTimeout(
        () => {
          merge(
            this.state.account$.pipe(map(createActionCreator(ReduxActionTypes.SetAccount))),
            this.state.accountDevice$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountDevice))),
            this.state.accountBalance$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountBalance))),
            this.state.deviceAddress$.pipe(map(createActionCreator(ReduxActionTypes.SetDeviceAddress))),
            this.state.networkVersion$.pipe(map(createActionCreator(ReduxActionTypes.SetNetworkVersion))),
            this.state.initialized$.pipe(map(createActionCreator(ReduxActionTypes.SetInitialized))),
            this.state.authenticated$.pipe(map(createActionCreator(ReduxActionTypes.SetAuthenticated))),
            this.state.connected$.pipe(map(createActionCreator(ReduxActionTypes.SetConnected))),
            this.actionService.$incoming.pipe(map(createActionCreator(ReduxActionTypes.SetIncomingAction))),
          )
            .subscribe(store.dispatch);
        },
        0,
      );

      return next => action => next(action);
    };
  }

  private require(options: {
    notInitialized?: boolean;
    connectedAccount?: boolean;
    disconnectedAccount?: boolean;
  } = {}): void {
    const { account, initialized } = this.state;

    if (!options.notInitialized && !initialized) {
      throw new Error('Setup uncompleted');
    }
    if (options.notInitialized && initialized) {
      throw new Error('Setup already completed');
    }

    if (options.connectedAccount && !account) {
      throw new Error('Account disconnected');
    }
    if (options.disconnectedAccount && account) {
      throw new Error('Account already connected');
    }
  }

  private async verifyAccount(account: IAccount): Promise<IAccount> {
    let result: IAccount = null;
    const { account$, accountDevice$, deviceAddress } = this.state;

    try {
      if (account) {
        const accountDevice = await this.accountService.getAccountDevice(account.address, deviceAddress);

        if (accountDevice) {
          account$.next(account);
          accountDevice$.next(accountDevice);

          result = account;
        } else {
          account$.next(null);
        }
      }

    } catch (err) {
      account$.next(null);
      accountDevice$.next(null);
      result = null;
    }

    return result;
  }

  private subscribeAccountBalance(): void {
    const { account$, accountBalance$ } = this.state;

    account$
      .pipe(
        filter(account => !!account),
        switchMap(account => account
          ? timer(0, 5000)
            .pipe(
              switchMap(() => from(this.ethService.getBalance(account).catch(() => null))),
              filter(balance => !!balance),
              takeUntil(account$.pipe(filter(account => !account))),
            )
          : of(null),
        ),
      )
      .subscribe(accountBalance$);
  }
}
