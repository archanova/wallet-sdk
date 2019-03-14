import { IBN } from 'bn.js';
import {
  IAccount,
  IAccountDevice,
  IDevice,
} from '../services';

export interface IReduxState {
  account: IAccount;
  accountBalance: IBN;
  accountDevice: IAccountDevice;
  device: IDevice;
  networkVersion: string;
  initialized: boolean;
  authenticated: boolean;
  connected: boolean;
}
