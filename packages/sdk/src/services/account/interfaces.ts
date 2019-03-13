import { IBN } from 'bn.js';
import { IDevice } from '../device';
import {
  AccountDeviceStates,
  AccountDeviceTypes,
  AccountStates,
  AccountDeployModes, AccountTransactionTypes,
} from './constants';

export interface IAccountService {
  getAccountAddressByEnsName(ensName: string): Promise<string>;

  getAccounts(): Promise<IAccount[]>;

  getAccount(accountAddress?: string): Promise<IAccount>;

  getAccountDevices(): Promise<IAccountDevice[]>;

  getAccountTransactions(): Promise<IAccountTransaction[]>;

  getAccountDevice(deviceAddress: string): Promise<IAccountDevice>;

  createAccountDevice(deviceAddress: string): Promise<boolean>;

  removeAccountDevice(deviceAddress: string): Promise<boolean>;
}

export interface IAccount {
  id: number;
  ensName: string;
  address: string;
  state: AccountStates;
  nextState: AccountStates;
  deployMode: AccountDeployModes;
  updatedAt: any;
}

export interface IAccountDevice {
  device: IDevice;
  type: AccountDeviceTypes;
  state: AccountDeviceStates;
  nextState: AccountDeviceStates;
  updatedAt: any;
}

export interface IAccountTransaction {
  hash: string;
  address: string;
  type: AccountTransactionTypes;
  value: IBN;
  updatedAt: any;
}
