import { Api } from './Api';
import { Device } from './Device';
import { State } from './State';

export class AccountFriendRecovery {
  constructor(
    private api: Api,
    private device: Device,
    private state: State,
  ) {
    //
  }
}
