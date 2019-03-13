import { IBN } from 'bn.js';
import { abiEncodePacked, getMethodSignature } from '@netgum/utils';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IDeviceService } from '../device';
import { IAccountProxyService } from './interfaces';

export class AccountProxyService implements IAccountProxyService {
  constructor(
    private options: IAccountProxyService.IOptions,
    private api: IApi,
    private state: IState,
    private deviceService: IDeviceService,
  ) {
    //
  }

  public async estimateTransaction(to: string, value: IBN, data: Buffer, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const { contractAddress } = this.options;
      const { accountAddress } = this.state;

      result = await this.api.sendHttpRequest<IAccountProxyService.IEstimatedTransaction>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/transaction`,
        method: 'POST',
        body: {
          to,
          value,
          data,
          gasPrice,
        },
      });
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async estimateDeployDevice(deviceAddress: string, gasPrice: IBN): Promise<IAccountProxyService.IEstimatedTransaction> {
    let result: IAccountProxyService.IEstimatedTransaction = null;

    try {
      const { contractAddress } = this.options;
      const { accountAddress } = this.state;

      result = await this.api.sendHttpRequest<IAccountProxyService.IEstimatedTransaction>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/device/${deviceAddress}`,
        method: 'POST',
        body: {
          gasPrice,
        },
      });
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async executeTransaction(estimated: IAccountProxyService.IEstimatedTransaction, gasPrice: IBN): Promise<string> {
    let result: string = null;

    const { contractAddress } = this.options;
    const { accountAddress } = this.state;
    const { nonce, data, fixedGas } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      accountAddress,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      const { hash } = await this.api.sendHttpRequest<{
        hash: string;
      }>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/transaction`,
        method: 'PUT',
        body: {
          data,
          gasPrice,
          nonce,
          signature,
        },
      });

      result = hash;
    } catch (err) {
      result = null;
    }

    return result;
  }

  public async deployDevice(deviceAddress: string, estimated: IAccountProxyService.IEstimatedTransaction, gasPrice: IBN): Promise<string> {
    let result: string = null;

    const { contractAddress } = this.options;
    const { accountAddress } = this.state;
    const { nonce, data, fixedGas } = estimated;

    const message = abiEncodePacked(
      'address',
      'bytes',
      'address',
      'uint256',
      'bytes',
      'uint256',
      'uint256',
    )(
      contractAddress,
      getMethodSignature('forwardAccountOwnerCall', 'address', 'uint256', 'bytes', 'uint256', 'bytes'),
      accountAddress,
      nonce,
      data,
      fixedGas,
      gasPrice,
    );

    const signature = await this.deviceService.signPersonalMessage(message);

    try {
      const { hash } = await this.api.sendHttpRequest<{
        hash: string;
      }>({
        path: `account-proxy/${contractAddress}/account/${accountAddress}/device/${deviceAddress}`,
        method: 'PUT',
        body: {
          data,
          gasPrice,
          nonce,
          signature,
        },
      });

      result = hash;
    } catch (err) {
      result = null;
    }

    return result;
  }
}
