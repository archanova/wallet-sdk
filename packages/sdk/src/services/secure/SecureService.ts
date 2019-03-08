import { anyToHex } from '@netgum/utils';
import { IAccountLinkingActions } from '../account';
import { IApiService } from '../api';
import { IDeviceService } from '../device';
import { ILinkingService } from '../linking';
import { ISecureService } from './interfaces';

export class SecureService implements ISecureService {
  constructor(
    private apiService: IApiService,
    private deviceService: IDeviceService,
    private linkingService: ILinkingService,
  ) {
    //
  }

  public async createCodeUrl(): Promise<ILinkingService.TUrlCreator> {
    const code = await this.sendCreateCode();

    return this.linkingService.createActionUrl<IAccountLinkingActions.ISignSecureCodePayload>({
      type: IAccountLinkingActions.Types.SignSecureCode,
      payload: {
        code,
        creatorAddress: this.deviceService.device.address,
      },
    });
  }

  public async verifyCode(creatorAddress: string, code: string): Promise<void> {
    const signature = anyToHex(await this.deviceService.signPersonalMessage(code), { add0x: true });

    await this.sendVerifyCode(creatorAddress, signature);
  }

  public async destroyCode(): Promise<void> {
    await this.sendDestroyCode();
  }

  private async sendCreateCode(): Promise<string> {
    const { code } = await this.apiService.sendHttpRequest<{
      code: string;
    }>({
      method: 'POST',
      path: 'secure',
      body: {},
    });

    return code;
  }

  private async sendVerifyCode(creatorAddress: string, signature: string): Promise<boolean> {
    const { success } = await this.apiService.sendHttpRequest<{
      success: boolean;
    }, {
      creatorAddress: string;
      signature: string;
    }>({
      method: 'PUT',
      path: 'secure',
      body: {
        creatorAddress,
        signature,
      },
    });

    return success;
  }

  private async sendDestroyCode(): Promise<boolean> {
    const { success } = await this.apiService.sendHttpRequest<{
      success: boolean;
    }>({
      method: 'DELETE',
      path: 'secure',
    });

    return success;
  }
}
