import { IBN } from 'bn.js';
import { Subject } from 'rxjs';
import { IAccount, IAccountDevice, IDevice } from '../services';

export interface IState {
  readonly account$: Subject<IAccount>;
  readonly accountDevice$: Subject<IAccountDevice>;
  readonly accountBalance$: Subject<IBN>;
  readonly device$: Subject<IDevice>;
  readonly network$: Subject<string>;
  readonly initialized$: Subject<boolean>;
  readonly authenticated$: Subject<boolean>;
  readonly connected$: Subject<boolean>;

  readonly account: IAccount;
  readonly accountAddress: string;
  readonly accountDevice: IAccountDevice;
  readonly accountBalance: IBN;
  readonly device: IDevice;
  readonly deviceAddress: string;
  readonly network: string;
  readonly initialized: boolean;
  readonly authenticated: boolean;
  readonly connected: boolean;


  setup(): Promise<void>;

  reset(): void;
}
