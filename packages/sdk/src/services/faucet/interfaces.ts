import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { IBN } from 'bn.js';

export interface IFaucetService {
  unlockedTo$: TUniqueBehaviorSubject<number>;
  unlockedTo: number;

  getFunds(): Promise<IBN>;
}

export namespace IFaucetService {
  export interface IReceipt {
    hash: string;
    value: IBN;
    calledAt: number;
    unlockedTo: number;
  }
}
