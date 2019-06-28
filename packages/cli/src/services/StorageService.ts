import { join } from 'path';
import { sdkModules } from '@archanova/sdk';
import { pathExists, ensureDir, readFile, remove, writeFile } from 'fs-extra';

export class StorageService {
  constructor(private options: StorageService.IOptions) {
    //
  }

  public async hasPostfix(postfix: StorageService.KeyPostfixes): Promise<boolean> {
    const path = await this.postfixToPath(postfix);
    return pathExists(path);
  }

  public toSdkAdapter(): sdkModules.Storage.IAdapter {
    return {
      getItem: async (key: string) => {
        const postfix = this.keyToPostfix(key);

        let result: string = null;

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix);
            result = await readFile(path, 'utf8');
          } catch (err) {
            //
          }
        }
        return result;
      },
      setItem: async (key: string, value: string) => {
        const postfix = this.keyToPostfix(key);

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix, true);
            await writeFile(path, value, 'utf8');
          } catch (err) {
            //
          }
        }
      },

      removeItem: async (key: string) => {
        const postfix = this.keyToPostfix(key);

        if (postfix) {
          try {
            const path = await this.postfixToPath(postfix);
            await remove(path);
          } catch (err) {
            //
          }
        }
      },
    };
  }

  private async postfixToPath(postfix: StorageService.KeyPostfixes, ensure: boolean = false): Promise<string> {
    let rootPath: string = null;
    const { globalRootPath, localRootPath } = this.options;

    switch (postfix) {
      case StorageService.KeyPostfixes.Account:
      case StorageService.KeyPostfixes.AccountDevice:
      case StorageService.KeyPostfixes.DevicePrivateKey:
        rootPath = globalRootPath;
        break;

      case StorageService.KeyPostfixes.App:
        rootPath = localRootPath;
        break;
    }

    if (rootPath) {
      rootPath = join(rootPath, '.archanova');

      if (ensure) {
        await ensureDir(rootPath);
      }
    }

    return rootPath ? join(rootPath, `${this.postfixToKey(postfix)}.json`) : null;
  }

  private keyToPostfix(key: string): StorageService.KeyPostfixes {
    let result: StorageService.KeyPostfixes;
    const { namespace } = this.options;
    const type = key.substr(namespace.length + 1);

    switch (type) {
      case StorageService.KeyPostfixes.Account:
      case StorageService.KeyPostfixes.AccountDevice:
      case StorageService.KeyPostfixes.DevicePrivateKey:
      case StorageService.KeyPostfixes.App:
        result = type as any;
        break;
    }

    return result;
  }

  private postfixToKey(postfix: StorageService.KeyPostfixes): string {
    const { namespace } = this.options;
    return `${namespace}:${postfix}`;
  }
}

export namespace StorageService {
  export interface IOptions {
    namespace?: string;
    globalRootPath: string;
    localRootPath: string;
  }

  export enum KeyPostfixes {
    Account = 'account',
    AccountDevice = 'account_device',
    DevicePrivateKey = 'device:private_key',
    App = 'app',
  }
}
