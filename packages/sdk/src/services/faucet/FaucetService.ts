import { IBN } from 'bn.js';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IStorage } from '../../storage';
import { IFaucetService, IFaucet } from './interfaces';

export class FaucetService implements IFaucetService {
  public static STORAGE_NAMESPACE = 'FaucetService';

  public unlockedTo$ = new UniqueBehaviorSubject<number>();

  constructor(
    private api: IApi,
    private state: IState,
    private storage: IStorage,
  ) {
    state
      .account$
      .pipe(
        switchMap(account => from(this.loadState())),
      )
      .subscribe(state.faucet$);
  }

  public get unlockedTo(): number {
    return this.unlockedTo$.getValue();
  }

  public async getFunds(): Promise<IFaucet> {
    let result: IFaucet = null;
    const { accountAddress, faucet, faucet$ } = this.state;

    if (
      accountAddress && (
        !faucet ||
        faucet.lockedTo < Date.now()
      )
    ) {
      const { value, ...receipt } = await this.api.sendHttpRequest<{
        hash: string;
        value: IBN;
        calledAt: number;
        lockedTo: number;
      }>({
        method: 'POST',
        path: `faucet/${accountAddress}`,
        body: {},
      });

      const calledAt = Date.now();

      result = {
        value,
        lockedTo: calledAt + receipt.lockedTo - receipt.calledAt,
      };

      await this.storage.setItem<IFaucet>(`${FaucetService.STORAGE_NAMESPACE}/${accountAddress}`, result);

      faucet$.next(result);
    }

    return result;
  }

  private async loadState(): Promise<IFaucet> {
    let result: IFaucet = null;
    const { accountAddress } = this.state;

    if (accountAddress) {
      result = await this.storage.getItem<IFaucet>(
        `${FaucetService.STORAGE_NAMESPACE}/${accountAddress}`,
      );
    }

    return result || null;
  }
}
