import meow from 'meow';
import { homedir } from 'os';
import { resolve } from 'path';
import { SdkEnvironmentNames } from '@archanova/sdk';
import { verifyPrivateKey, anyToBuffer } from '@netgum/utils';
import { Actions } from './constants';

const { input: inputs, flags }: {
  input: string[];
  flags: {
    env: SdkEnvironmentNames | 'local';
    global: boolean;
    help: boolean;
    localEnvHost: string;
    localEnvPort: string;
    privateKey: string;
  };
} = meow({
  booleanDefault: false,
  autoHelp: false,
  autoVersion: false,
  flags: {
    env: {
      type: 'string',
      alias: 'e',
      default: SdkEnvironmentNames.Kovan,
    },
    global: {
      type: 'boolean',
      alias: 'g',
    },
    help: {
      type: 'boolean',
      alias: 'h',
    },
    localEnvHost: {
      type: 'string',
      default: null,
    },
    localEnvPort: {
      type: 'string',
      default: null,
    },
    privateKey: {
      type: 'string',
      default: null,
    },
  },
});

export interface IConfig {
  action: Actions;
  env: SdkEnvironmentNames | 'local';
  localEnv: {
    host: string;
    port: number;
  };
  localRootPath: string;
  globalRootPath: string;
  showHelp: boolean;
  privateKey: Buffer;
}

const supportedEnvs = [...Object.values(SdkEnvironmentNames), 'local'];
const supportedActions = Object.values(Actions);
const privateKey: Buffer = anyToBuffer(flags.privateKey, { defaults: null });
let workingPath = process.cwd();
let action: Actions = null;

for (const input of inputs) {
  if (supportedActions.includes(input)) {
    action = input as any;
  } else {
    if (
      input.startsWith('/') ||
      input.startsWith('.')
    ) {
      workingPath = resolve(input);
    }
    break;
  }
}

if (!supportedEnvs.includes(flags.env)) {
  throw new Error('Unsupported env'); // TODO: add error handler
}

if (privateKey && !verifyPrivateKey(privateKey)) {
  throw new Error('Invalid private key'); // TODO: add error handler
}

const config: IConfig = {
  action,
  privateKey,
  env: flags.env,
  localEnv: {
    host: flags.localEnvHost,
    port: parseInt(flags.localEnvPort, 10) || null,
  },
  globalRootPath: flags.global ? homedir() : workingPath,
  localRootPath: workingPath,
  showHelp: flags.help,
};

export default config;
