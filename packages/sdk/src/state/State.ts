import { IBN } from 'bn.js';
import { from, Subscription } from 'rxjs';
import { UniqueBehaviorSubject, TUniqueBehaviorSubject } from 'rxjs-addons';
import { skip, switchMap } from 'rxjs/operators';
import { IStorageService, IAccount, IAccountDevice, IDevice } from '../services';
import { IState } from './interfaces';

export class State implements IState {
  public static STORAGE_NAMESPACE = 'State';

  public account$ = new UniqueBehaviorSubject<IAccount>();
  public accountDevice$ = new UniqueBehaviorSubject<IAccountDevice>();
  public accountBalance$ = new UniqueBehaviorSubject<IBN>();
  public device$ = new UniqueBehaviorSubject<IDevice>();
  public network$ = new UniqueBehaviorSubject<string>();
  public initialized$ = new UniqueBehaviorSubject<boolean>(false);
  public authenticated$ = new UniqueBehaviorSubject<boolean>(false);
  public connected$ = new UniqueBehaviorSubject<boolean>(null);

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

  public get network(): string {
    return this.network$.getValue();
  }

  public get initialized(): boolean {
    return this.initialized$.getValue();
  }

  public get authenticated(): boolean {
    return this.authenticated$.getValue();
  }

  public get connected(): boolean {
    return this.connected$.getValue();
  }

  constructor(public storageService: IStorageService) {
    //
  }

  public async setup(): Promise<void> {
    this.reset();

    await Promise.all([
      this.attachToStorage(this.account$, 'account'),
      this.attachToStorage(this.accountDevice$, 'accountDevice'),
      this.attachToStorage(this.network$, 'network'),
    ]);
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
    this.network$.next(null);
    this.initialized$.next(false);
    this.authenticated$.next(false);
    this.connected$.next(null);
  }

  private async attachToStorage(subject: TUniqueBehaviorSubject, key: string): Promise<void> {
    key = `${State.STORAGE_NAMESPACE}/${key}`;

    const value = await this.storageService.getItem(key);
    if (value) {
      subject.next(value);
    }

    this.subscriptions.push(
      subject
        .pipe(
          skip(1),
          switchMap(value =>
            from(this.storageService.setItem(key, value).catch(() => null)),
          ),
        )
        .subscribe(),
    );
  }
}