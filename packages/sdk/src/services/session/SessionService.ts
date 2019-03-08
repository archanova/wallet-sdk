import { anyToHex } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IApiService } from '../api';
import { IDeviceService } from '../device';
import { ISessionService } from './interfaces';

export class SessionService implements ISessionService {
  public readonly ready$ = new UniqueBehaviorSubject<boolean>(false);

  constructor(
    private apiService: IApiService,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public get ready(): boolean {
    return this.ready$.getValue();
  }

  public async create(): Promise<void> {
    if (this.ready) {
      throw new Error('Session already created');
    }

    const code = await this.sendCreateCode();
    const token = await this.sendCreateToken(code);

    this.apiService.setSessionToken(token);

    this.ready$.next(true);
  }

  public async reset(): Promise<void> {
    if (!this.ready) {
      await this.create();
      return;
    }

    this.ready$.next(false);

    await this.sendDestroy();

    this.apiService.setSessionToken();

    await this.create();
  }

  private async sendCreateCode(): Promise<string> {
    const { code } = await this.apiService.sendHttpRequest<{
      code: string;
    }, {
      deviceAddress: string;
    }>({
      method: 'POST',
      path: 'session',
      body: {
        deviceAddress: this.deviceService.device.address,
      },
    });

    return code;
  }

  private async sendCreateToken(code: string): Promise<string> {
    const signature = anyToHex(await this.deviceService.signPersonalMessage(code), {
      add0x: true,
    });

    const { token } = await this.apiService.sendHttpRequest<{
      token: string;
    }, {
      code: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'session',
      body: {
        code,
        signature,
      },
    });

    return token;
  }

  private async sendDestroy(): Promise<boolean> {
    const { success } = await this.apiService.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'session',
    });

    return success;
  }
}
