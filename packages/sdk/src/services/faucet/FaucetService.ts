import { IBN } from 'bn.js';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IStorage } from '../../storage';
import { IApiService } from '../api';
import { IAccount, IAccountService } from '../account';
import { IFaucetService } from './interfaces';

export class FaucetService implements IFaucetService {
  public static STORAGE_NAMESPACES = {
    unlockedTo: 'FaucetService/unlockedTo',
  };

  public unlockedTo$ = new UniqueBehaviorSubject<number>();

  constructor(
    private storage: IStorage,
    private apiService: IApiService,
    private accountService: IAccountService,
  ) {
    this
      .accountService
      .account$
      .pipe(
        switchMap(account => from(this.getAccountUnlockedTo(account))),
      )
      .subscribe(this.unlockedTo$);
  }

  public get unlockedTo(): number {
    return this.unlockedTo$.getValue();
  }

  public async getFunds(): Promise<IBN> {
    let result: IBN = null;
    const { account } = this.accountService;

    if (
      account && (
        !this.unlockedTo ||
        this.unlockedTo < Date.now()
      )
    ) {
      const receipt = await this.sendGetFunds(account.address);
      const calledAt = Date.now();
      const unlockedTo = calledAt + receipt.unlockedTo - receipt.calledAt;

      await this.setAccountUnlockedTo(account, unlockedTo);

      this.unlockedTo$.next(unlockedTo);

      result = receipt.value;
    }

    return result;
  }

  private sendGetFunds(accountAddress: string): Promise<IFaucetService.IReceipt> {
    return this.apiService.sendHttpRequest<IFaucetService.IReceipt>({
      method: 'POST',
      path: `faucet/${accountAddress}`,
      body: {},
    });
  }

  private async getAccountUnlockedTo(account: IAccount): Promise<number> {
    let result = 0;
    if (account) {
      result = await this.storage.getItem<number>(
        `${FaucetService.STORAGE_NAMESPACES.unlockedTo}/${account.address}`,
      );
    }
    return result || 0;
  }

  private setAccountUnlockedTo(account: IAccount, unlockedTo: number): Promise<void> {
    return this.storage.setItem<number>(
      `${FaucetService.STORAGE_NAMESPACES.unlockedTo}/${account.address}`,
      unlockedTo,
    );
  }
}
