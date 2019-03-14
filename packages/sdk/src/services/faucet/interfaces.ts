import { IBN } from 'bn.js';

export interface IFaucetService {
  getFunds(): Promise<IFaucetService.IReceipt>;
}

export namespace IFaucetService {
  export interface IReceipt {
    lockedTo: number;
    value: IBN;
  }
}