import { IBN } from 'bn.js';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IFaucetService } from './interfaces';

export class FaucetService implements IFaucetService {

  constructor(
    private api: IApi,
    private state: IState,
  ) {
    //
  }

  public async getFunds(): Promise<IFaucetService.IReceipt> {
    let result: IFaucetService.IReceipt = null;
    const { accountAddress } = this.state;

    if (accountAddress) {
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
    }

    return result;
  }
}
