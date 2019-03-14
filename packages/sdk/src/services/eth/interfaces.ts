import { IBN } from 'bn.js';

export interface IEthService {
  detectNetworkVersion(force?: boolean): Promise<string>;

  getGasPrice(): Promise<IBN>;

  getBalance(target: any): Promise<IBN>;

  getTransactionCount(target: any): Promise<IBN>;
}

export namespace IEthService {
  export interface IOptions {
    providerEndpoint?: string;
    customProvider?: any;
  }
}
