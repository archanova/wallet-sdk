import { targetToAddress } from '@netgum/utils';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import * as BN from 'bn.js';
import * as Eth from 'ethjs';
import { IState } from '../../state';
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
    private state: IState,
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
              .then(res => res.json())
              .then(data => callback(null, data))
              .catch(err => callback(new EthError(err), null));
          },
        };

      this.eth = new Eth(provider);
    }
  }

  public async detectNetwork(force = false): Promise<void> {
    const { network, network$ } = this.state;

    if (!network || force) {
      const network = await this.eth.net_version();

      if (network) {
        network$.next(network);
      }
    }
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
