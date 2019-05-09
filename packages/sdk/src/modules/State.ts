import BN from 'bn.js';
import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { from } from 'rxjs';
import { skip, switchMap } from 'rxjs/operators';
import { Action } from './Action';
import { Storage } from './Storage';
import { IAccount, IAccountDevice, IDevice } from '../interfaces';

export class State {
  public initialized$ = new UniqueBehaviorSubject<boolean>();
  public connected$ = new UniqueBehaviorSubject<boolean>();
  public account$ = new UniqueBehaviorSubject<IAccount>();
  public accountBalance$ = new UniqueBehaviorSubject<BN>();
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>();
  public device$ = new UniqueBehaviorSubject<IDevice>();
  public ens$ = new UniqueBehaviorSubject<State.IEns>();
  public eth$ = new UniqueBehaviorSubject<State.IEth>();
  public session$ = new UniqueBehaviorSubject<State.ISession>();
  public incomingAction$: TUniqueBehaviorSubject<Action.IAction>;

  constructor(private storage: Storage) {
    //
  }

  public get initialized(): boolean {
    return this.initialized$.value;
  }

  public get connected(): boolean {
    return this.connected$.value;
  }

  public get account(): IAccount {
    return this.account$.value;
  }

  public get accountAddress(): string {
    const { value } = this.account$;
    return value
      ? value.address
      : null;
  }

  public get accountBalance(): BN {
    return this.accountBalance$.value;
  }

  public get accountDevice(): IAccountDevice {
    return this.accountDevice$.value;
  }

  public get device(): IDevice {
    return this.device$.value;
  }

  public get deviceAddress(): string {
    const { value } = this.device$;
    return value
      ? value.address
      : null;
  }

  public get ens(): State.IEns {
    return this.ens$.value;
  }

  public get eth(): State.IEth {
    return this.eth$.value;
  }

  public get session(): State.ISession {
    return this.session$.value;
  }

  public get sessionToken(): string {
    const { value } = this.session$;
    return value
      ? value.token
      : null;
  }

  public get incomingAction(): Action.IAction {
    return this.incomingAction$.value;
  }

  public async setup(): Promise<void> {
    await Promise.all([
      this.attachToStorage(this.account$, State.StorageKeys.Account),
      this.attachToStorage(this.accountDevice$, State.StorageKeys.AccountDevice),
      this.attachToStorage(this.session$, State.StorageKeys.Session),
    ]);
  }

  private async attachToStorage(subject: TUniqueBehaviorSubject, key: State.StorageKeys): Promise<void> {
    const value = await this.storage.getItem(key);
    if (value) {
      subject.next(value);
    }

    subject
      .pipe(
        skip(1),
        switchMap(value =>
          from(this.storage.setItem(key, value).catch(() => null)),
        ),
      )
      .subscribe();
  }
}

export namespace State {
  export enum StorageKeys {
    Account = 'account',
    AccountDevice = 'accountDevice',
    Session = 'session',
  }

  export interface IEns {
    supportedRoots: {
      name: string;
      nameHash: string;
    }[];
  }

  export interface IEth {
    networkId: string;
    gasPrice: BN;
  }

  export interface ISession {
    token: string;
  }
}