import { IBN } from 'bn.js';
import { Subject } from 'rxjs';
import { IAccount, IAccountDevice, IDevice, IFaucet } from '../services';

export interface IState {
  readonly account$: Subject<IAccount>;
  readonly accountDevice$: Subject<IAccountDevice>;
  readonly accountBalance$: Subject<IBN>;
  readonly device$: Subject<IDevice>;
  readonly faucet$: Subject<IFaucet>;
  readonly network$: Subject<string>;
  readonly completed$: Subject<boolean>;
  readonly ready$: Subject<boolean>;
  readonly online$: Subject<boolean>;

  readonly account: IAccount;
  readonly accountDevice: IAccountDevice;
  readonly accountBalance: IBN;
  readonly device: IDevice;
  readonly faucet: IFaucet;
  readonly network: string;
  readonly completed: boolean;
  readonly ready: boolean;
  readonly online: boolean;

  readonly accountAddress: string;
  readonly deviceAddress: string;

  setup(): Promise<void>;

  reset(): void;
}
