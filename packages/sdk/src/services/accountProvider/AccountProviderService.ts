import { IBN } from 'bn.js';
import { IState } from '../../state';
import { IApi } from '../../api';
import { IAccount } from '../account';
import { IAccountProviderService } from './interfaces';

export class AccountProviderService implements IAccountProviderService {

  constructor(
    private options: IAccountProviderService.IOptions,
    private api: IApi,
    private state: IState,
  ) {
    //
  }

  public async createAccount(ensName: string = null): Promise<IAccount> {
    const { contractAddress } = this.options;
    const { item } = await this.api.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'POST',
      path: `account-provider/${contractAddress}/account`,
      body: ensName
        ? { ensName }
        : {},
    });

    return item;
  }

  public async updateAccount(name: string): Promise<IAccount> {
    const { contractAddress } = this.options;
    const { accountAddress } = this.state;

    const { item } = await this.api.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'PUT',
      path: `account-provider/${contractAddress}/account/${accountAddress}`,
      body: {
        name,
      },
    });

    return item;
  }

  public async estimateDeployAccountCost(gasPrice: IBN): Promise<IBN> {
    const { contractAddress } = this.options;
    const { accountAddress } = this.state;
    const { refundAmount } = await this.api.sendHttpRequest<{
      refundAmount: IBN;
    }>({
      method: 'POST',
      path: `account-provider/${contractAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return refundAmount;
  }

  public async deployAccount(gasPrice: IBN): Promise<boolean> {
    const { contractAddress } = this.options;
    const { accountAddress } = this.state;
    const { hash } = await this.api.sendHttpRequest<{
      refundAmount: IBN;
      hash: string;
    }>({
      method: 'PUT',
      path: `account-provider/${contractAddress}/account/${accountAddress}/deploy`,
      body: {
        gasPrice,
      },
    });

    return !!hash;
  }
}
