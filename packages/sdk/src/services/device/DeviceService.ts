import { generateRandomPrivateKey, privateKeyToAddress, signPersonalMessage } from '@netgum/utils';
import { IState } from '../../state';
import { IStorage } from '../../storage';
import { IDeviceService } from './interfaces';

export class DeviceService implements IDeviceService {
  public static STORAGE_KEYS = {
    privateKey: 'DeviceService/privateKey',
  };

  private privateKey: Buffer = null;

  constructor(
    private state: IState,
    private storage: IStorage,
  ) {
    //
  }

  public async setup(): Promise<void> {
    if (this.storage) {
      this.privateKey = await this.storage.getItem<Buffer>(DeviceService.STORAGE_KEYS.privateKey);
    }

    if (!this.privateKey) {
      this.privateKey = generateRandomPrivateKey();

      if (this.storage) {
        await this.storage.setItem(DeviceService.STORAGE_KEYS.privateKey, this.privateKey);
      }

    }

    this.createDevice();
  }

  public async reset(): Promise<void> {
    this.privateKey = generateRandomPrivateKey();

    if (this.storage) {
      await this.storage.setItem(DeviceService.STORAGE_KEYS.privateKey, this.privateKey);
    }

    this.createDevice();
  }

  public async signPersonalMessage(message: string | Buffer): Promise<Buffer> {
    return signPersonalMessage(message, this.privateKey);
  }

  private createDevice(): void {
    const { device$ } = this.state;
    const address = privateKeyToAddress(this.privateKey);

    device$.next({
      address,
    });
  }
}
