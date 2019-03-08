import { targetToAddress } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import * as BN from 'bn.js';
import * as Eth from 'ethjs';
import { IStorage } from '../../storage';
import { EthError } from './EthError';
import { IEthService } from './interfaces';

export class EthService implements IEthService {
  public static STORAGE_KEYS = {
    networkVersion: 'EthService/networkVersion',
  };

  public readonly networkVersion$ = new UniqueBehaviorSubject<string>(null);

  constructor(
    options: IEthService.IOptions,
    private storage: IStorage,
    private readonly eth: Eth.IEth = null,
  ) {
    if (!this.eth) {
      const { providerEndpoint, customProvider } = options;

      const provider = customProvider
        ? customProvider
        : {
          sendAsync: (payload: any, callback: (err: any, data: any) => void) => {

            const options: RequestInit = {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              }),
              body: JSON.stringify(payload),
            };

            fetch(providerEndpoint, options)
              .then(({ json }) => json())
              .then(data => callback(null, data))
              .catch(err => callback(new EthError(err), null));
          },
        };

      this.eth = new Eth(provider);
    }
  }

  public get networkVersion(): string {
    return this.networkVersion$.getValue();
  }

  public async setup(): Promise<void> {
    let storageNetworkVersion: string = null;

    if (this.storage) {
      storageNetworkVersion = await this.storage.getItem<string>(EthService.STORAGE_KEYS.networkVersion);
    }

    let networkVersion: string = null;

    if (!networkVersion) {
      networkVersion = await this.eth.net_version();
    } else {
      try {
        networkVersion = await this.eth.net_version();
      } catch (err) {
        networkVersion = storageNetworkVersion;
      }
    }

    if (
      this.storage &&
      (!storageNetworkVersion || storageNetworkVersion !== networkVersion)
    ) {
      await this.storage.setItem(EthService.STORAGE_KEYS.networkVersion, networkVersion);
    }

    this.networkVersion$.next(networkVersion);
  }

  public getGasPrice(): Promise<BN.IBN> {
    return this.eth.gasPrice();
  }

  public async getBalance(target: any): Promise<BN.IBN> {
    let result: BN.IBN = new BN(0);
    const address: string = targetToAddress(target);

    if (address) {
      result = await this.eth.getBalance(address, 'pending');
    }

    return result;
  }

  public async getTransactionCount(target: any): Promise<BN.IBN> {
    let result: BN.IBN = new BN(0);
    const address: string = targetToAddress(target);

    if (address) {
      result = await this.eth.getTransactionCount(address, 'pending');
    }

    return result;
  }
}
