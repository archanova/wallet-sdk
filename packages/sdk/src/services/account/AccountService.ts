import { IApi } from '../../api';
import { IState } from '../../state';
import { IAccount, IAccountDevice, IAccountService, IAccountTransaction } from './interfaces';

export class AccountService implements IAccountService {
  constructor(
    private api: IApi,
    private state: IState,
  ) {
    //
  }

  public async getAccountAddressByEnsName(ensName: string): Promise<string> {
    let result: string = null;
    try {
      const { address } = await this.api.sendHttpRequest<{
        address: string;
      }>({
        method: 'GET',
        path: `account/lookup/${ensName}`,
      });
      result = address;
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async getAccounts(): Promise<IAccount[]> {
    const { items } = await this.api.sendHttpRequest<{
      items: IAccount[];
    }>({
      method: 'GET',
      path: 'account',
    });

    return items;
  }

  public async getAccount(accountAddress: string): Promise<IAccount> {
    if (!accountAddress) {
      ({ accountAddress } = this.state);
    }
    const { item } = await this.api.sendHttpRequest<{
      item: IAccount;
    }>({
      method: 'GET',
      path: `account/${accountAddress}`,
    });

    return item;
  }

  public async getAccountDevices(): Promise<IAccountDevice[]> {
    const { accountAddress } = this.state;
    const { items } = await this.api.sendHttpRequest<{
      items: IAccountDevice[];
    }>({
      method: 'GET',
      path: `account/${accountAddress}/device`,
    });

    return items;
  }

  public async getAccountTransactions(): Promise<IAccountTransaction[]> {
    const { accountAddress } = this.state;
    const { items } = await this.api.sendHttpRequest<{
      items: IAccountTransaction[];
    }>({
      method: 'GET',
      path: `account/${accountAddress}/transaction`,
    });

    return items;
  }

  public async getAccountDevice(deviceAddress: string): Promise<IAccountDevice> {
    const { accountAddress } = this.state;
    const { item } = await this.api.sendHttpRequest<{
      item: IAccountDevice;
    }>({
      method: 'GET',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return item;
  }

  public async createAccountDevice(deviceAddress: string): Promise<boolean> {
    const { accountAddress } = this.state;
    const { success } = await this.api.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'POST',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return success;
  }

  public async removeAccountDevice(deviceAddress: string): Promise<boolean> {
    const { accountAddress } = this.state;
    const { success } = await this.api.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: `account/${accountAddress}/device/${deviceAddress}`,
    });

    return success;
  }
}
