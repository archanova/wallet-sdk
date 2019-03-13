import { IBN } from 'bn.js';
import { from, Subscription } from 'rxjs';
import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { skip, switchMap } from 'rxjs/operators';
import { IAccount, IAccountDevice, IDevice, IFaucet } from '../services';
import { IStorage } from '../storage';
import { IState } from './interfaces';

export class State implements IState {
  public static STORAGE_NAMESPACE = 'State';

  public account$ = new UniqueBehaviorSubject<IAccount>();
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>();
  public accountBalance$ = new UniqueBehaviorSubject<IBN>();
  public device$ = new UniqueBehaviorSubject<IDevice>();
  public faucet$ = new UniqueBehaviorSubject<IFaucet>();
  public network$ = new UniqueBehaviorSubject<string>();
  public completed$ = new UniqueBehaviorSubject<boolean>(false);
  public ready$ = new UniqueBehaviorSubject<boolean>(false);
  public online$ = new UniqueBehaviorSubject<boolean>(null);

  private subscriptions: Subscription[] = [];

  public get account(): IAccount {
    return this.account$.getValue();
  }

  public get accountAddress(): string {
    return this.account ? this.account.address : null;
  }

  public get accountDevice(): IAccountDevice {
    return this.accountDevice$.getValue();
  }

  public get accountBalance(): IBN {
    return this.accountBalance$.getValue();
  }

  public get device(): IDevice {
    return this.device$.getValue();
  }

  public get deviceAddress(): string {
    return this.device ? this.device.address : null;
  }

  public get faucet(): IFaucet {
    return this.faucet$.getValue();
  }

  public get network(): string {
    return this.network$.getValue();
  }

  public get completed(): boolean {
    return this.completed$.getValue();
  }

  public get ready(): boolean {
    return this.ready$.getValue();
  }

  public get online(): boolean {
    return this.online$.getValue();
  }

  constructor(public storage: IStorage) {
    //
  }

  public async setup(): Promise<void> {
    this.reset();

    if (this.storage) {
      await Promise.all([
        this.attachToStorage(this.account$, 'account'),
        this.attachToStorage(this.accountDevice$, 'accountDevice'),
        this.attachToStorage(this.network$, 'network'),
        this.attachToStorage(this.device$, 'device'),
      ]);
    }
  }

  public reset(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions = [];

    this.account$.next(null);
    this.accountDevice$.next(null);
    this.accountBalance$.next(null);
    this.device$.next(null);
    this.faucet$.next(null);
    this.network$.next(null);
    this.completed$.next(false);
    this.ready$.next(false);
    this.online$.next(null);
  }

  private async attachToStorage(subject: TUniqueBehaviorSubject, key: string): Promise<void> {
    const value = await this.storage.getItem(`${State.STORAGE_NAMESPACE}/${key}`);
    if (value) {
      subject.next(value);
    }

    this.subscriptions.push(
      subject
        .pipe(
          skip(1),
          switchMap(value =>
            from(this.storage.setItem(key, value).catch(() => null)),
          ),
        )
        .subscribe(),
    );
  }
}
