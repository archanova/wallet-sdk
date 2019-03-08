import { Environment } from './Environment';

export const availableEnviroments = {
  development: new Environment({
    api: {
      host: 'api.development.archanova.run',
      port: null,
      useSsl: true,
      reconnectTimeout: 3000,
    },
    accountProvider: {
      contractAddress: '0x13266E4C16c279741f3cF0d9FE90D2d36B3669a2',
    },
    accountProxy: {
      contractAddress: '0xc9FE248E38a2F0Ac114932ecFF4B1bAc74E90b91',
    },
    eth: {
      providerEndpoint: 'https://eth.development.archanova.run',
    },
    linking: {},
  }),
};
