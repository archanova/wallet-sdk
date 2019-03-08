import { IBN } from 'bn.js';
import { TUniqueBehaviorSubject } from 'rxjs-addons';

export interface IAccountProviderService {
  supportedEnsName$: TUniqueBehaviorSubject<string>;
  supportedEnsName: string;

  setup(): Promise<void>;

  createAccount(ensName?: string): Promise<void>;

  updateAccount(ensName: string): Promise<void>;

  estimateAccountDeployment(): Promise<IAccountProviderService.IDeployment>;

  deployAccount(gasPrice: IBN): Promise<boolean>;
}

export namespace IAccountProviderService {
  export interface IOptions {
    contractAddress: string;
  }

  export interface ISettings {
    supportedEnsName: string;
  }

  export interface IDeployment {
    gasPrice: IBN;
    cost: IBN;
  }
}
