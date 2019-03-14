import { anyToHex } from '@netgum/utils';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IDeviceService } from '../device';
import { ISessionService } from './interfaces';

export class SessionService implements ISessionService {
  constructor(
    private api: IApi,
    private state: IState,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public async createSession(): Promise<void> {
    const { deviceAddress, authenticated$, authenticated } = this.state;

    if (authenticated) {
      throw new Error('Session already created');
    }

    // create session code
    const { code } = await this.api.sendHttpRequest<{
      code: string;
    }, {
      deviceAddress: string;
    }>({
      method: 'POST',
      path: 'auth',
      body: {
        deviceAddress,
      },
    });

    const signature = anyToHex(await this.deviceService.signPersonalMessage(code), {
      add0x: true,
    });

    // create session token
    const { token } = await this.api.sendHttpRequest<{
      token: string;
    }, {
      code: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'auth',
      body: {
        code,
        signature,
      },
    });

    this.api.setSessionToken(token);

    authenticated$.next(true);
  }

  public async resetSession(): Promise<void> {
    const { authenticated$, authenticated } = this.state;

    if (!authenticated) {
      await this.createSession();
      return;
    }

    authenticated$.next(false);

    await this.api.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'auth',
    });

    this.api.setSessionToken();

    await this.createSession();
  }
}
