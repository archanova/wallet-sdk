import { IBN } from 'bn.js';
import { ISdk } from './interfaces';
import {
  IAccount,
  IAccountProviderService,
  IAccountProxyService,
  IAccountService,
  IActionService,
  IDeviceService,
  IEthService,
  IEventService,
  IFaucetService,
  ISecureService,
  ISessionService,
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
    public readonly accountService: IAccountService,
    public readonly accountProviderService: IAccountProviderService,
    public readonly accountProxyService: IAccountProxyService,
    public readonly actionService: IActionService,
    public readonly deviceService: IDeviceService,
    public readonly ethService: IEthService,
    public readonly eventService: IEventService,
    public readonly faucetService: IFaucetService,
    public readonly secureService: ISecureService,
    public readonly sessionService: ISessionService,
    public readonly urlService: IUrlService,
  ) {
    //
  }

  public async setup(): Promise<void> {
    this.require({
      uncompleted: true,
    });

    const { completed$ } = this.state;

    await this.state.setup();
    await this.deviceService.setup();
    await this.sessionService.createSession();

    completed$.next(true);
  }

  public async reset(): Promise<void> {
    this.require();
  }

  public async getGasPrice(): Promise<IBN> {
    return this.ethService.getGasPrice();
  }

  public async createAccount(ensName: string = null): Promise<boolean> {
    this.require({
      disconnectedAccount: true,
    });

    const account = await this.accountProviderService.createAccount(ensName);

    return this.verifyAccount(account);
  }

  public async connectAccount(accountAddress: string): Promise<boolean> {
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

  private require(options: {
    uncompleted?: boolean;
    connectedAccount?: boolean;
    disconnectedAccount?: boolean;
  } = {}): void {
    const { account, completed } = this.state;

    if (!options.uncompleted && !completed) {
      throw new Error('Setup uncompleted');
    }
    if (options.uncompleted && completed) {
      throw new Error('Setup already completed');
    }

    if (options.connectedAccount && !account) {
      throw new Error('Account disconnected');
    }
    if (options.disconnectedAccount && account) {
      throw new Error('Account already connected');
    }
  }

  private async verifyAccount(account: IAccount): Promise<boolean> {
    let result = false;
    const { account$, accountDevice$, deviceAddress } = this.state;

    try {
      if (account) {
        account$.next(account);

        const accountDevice = await this.accountService.getAccountDevice(deviceAddress);

        if (accountDevice) {
          account$.next(account);
          accountDevice$.next(accountDevice);

          result = true;
        } else {
          account$.next(null);
        }
      }

    } catch (err) {
      account$.next(null);
      result = false;
    }

    return result;
  }
}
