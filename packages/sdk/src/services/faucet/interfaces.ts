import { IBN } from 'bn.js';

export interface IFaucetService {
  getFunds(): Promise<IFaucet>;
}

export interface IFaucet {
  lockedTo: number;
  value: IBN;
}
