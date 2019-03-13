import { IBN } from 'bn.js';
import { IAccount } from '../account';

export interface IAccountProviderService {

  createAccount(ensName?: string): Promise<IAccount>;

  updateAccount(ensName: string): Promise<IAccount>;

  estimateDeployAccountCost(gasPrice: IBN): Promise<IBN>;

  deployAccount(gasPrice: IBN): Promise<boolean>;
}

export namespace IAccountProviderService {
  export interface IOptions {
    contractAddress: string;
  }
}
