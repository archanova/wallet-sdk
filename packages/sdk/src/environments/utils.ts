import { ContractNames } from '@archanova/contracts';
import { Environment } from '../modules';
import {
  EnvironmentNames,
  kovanEnvironment,
  rinkebyEnvironment,
} from './constants';

/**
 * gets environment by name
 * @param name
 */
export function getEnvironment(name: EnvironmentNames): Environment {
  let result: Environment = null;

  switch (name) {
    case EnvironmentNames.Kovan:
      result = kovanEnvironment;
      break;

    case EnvironmentNames.Rinkeby:
      result = rinkebyEnvironment;
      break;
  }

  return result;
}

/**
 * creates local environment
 * @param host
 */
export function createLocalEnvironment(host = 'localhost'): Environment {
  return new Environment({
    apiOptions: {
      host,
      port: 8880,
      ssl: false,
      reconnectTimeout: 3000,
    },
    ensOptions: {
      supportedRootNames: ['archanova.local'],
    },
    ethOptions: {
      networkId: '65280',
      gasPrice: '0x77359400',
      contractAddresses: {
        [ContractNames.AccountProvider]: '0x63636CABbabaDD86D2675110cD469e77Bc87B36A',
        [ContractNames.AccountProxy]: '0xC64B61d239622Ab21283996b659E837cCDfF843F',
        [ContractNames.ENSRegistry]: '0x12939a4d566e460B7024d38b0A54535c8B282484',
        [ContractNames.VirtualPaymentManager]: '0xC5dFc16D722a4fa6afA59d94439c74537A4Ee70E',
      },
    },
    apiWebSocketConstructor: null,
    storageOptions: {
      namespace: '@archanova',
    },
    storageAdapter: null,
  });
}