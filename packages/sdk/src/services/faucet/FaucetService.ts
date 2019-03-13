import { IBN } from 'bn.js';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IStorage } from '../../storage';
import { IFaucetService, IFaucet } from './interfaces';

export class FaucetService implements IFaucetService {
  public static STORAGE_NAMESPACE = 'FaucetService';

  constructor(
    private api: IApi,
    private state: IState,
    private storage: IStorage,
  ) {
    state
      .account$
      .pipe(
        switchMap(() => from(this.getState())),
      )
      .subscribe(state.faucet$);
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

      if (this.storage) {
        await this.storage.setItem<IFaucet>(`${FaucetService.STORAGE_NAMESPACE}/${accountAddress}`, result);
      }

      faucet$.next(result);
    }

    return result;
  }

  private async getState(): Promise<IFaucet> {
    let result: IFaucet = null;

    const { accountAddress } = this.state;

    if (
      this.storage &&
      accountAddress
    ) {
      result = await this.storage.getItem<IFaucet>(
        `${FaucetService.STORAGE_NAMESPACE}/${accountAddress}`,
      );
    }

    return result || null;
  }
}
