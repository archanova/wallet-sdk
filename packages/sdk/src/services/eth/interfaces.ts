import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IBN } from 'bn.js';

export interface IEthService {
  readonly networkVersion$: TUniqueBehaviorSubject<string>;
  readonly networkVersion: string;

  setup(): Promise<void>;

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
