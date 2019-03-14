import { IBN } from 'bn.js';
import {
  IAccount,
  IAccountDevice,
} from '../services';

export interface IReduxState {
  account: IAccount;
  accountBalance: IBN;
  accountDevice: IAccountDevice;
  deviceAddress: string;
  networkVersion: string;
  initialized: boolean;
  authenticated: boolean;
  connected: boolean;
}
