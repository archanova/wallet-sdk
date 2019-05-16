import BN from 'bn.js';
import { BehaviorSubject } from 'rxjs';
import { anyToHex } from '@netgum/utils';
import { ILogger, ILoggerConsole, ILoggerEvent } from './interfaces';

const stream$ = new BehaviorSubject<ILoggerEvent>(null);
let counter = 0;

const wrappedConsole: Partial<Console> = {
  info(...args: any[]): void {
    console.log(...args);
    counter += 1;
    stream$.next({
      args,
      id: counter,
      type: 'info',
    });
  },
  error(...args: any[]): void {
    counter += 1;
    stream$.next({
      args,
      id: counter,
      type: 'error',
    });
    console.error(...args);
  },
};

function jsonReplacer(key: string, value: any): any {
  const data = this[key];

  if (
    Buffer.isBuffer(data) ||
    BN.isBN(data)
  ) {
    value = anyToHex(data, {
      add0x: true,
    });
  }

  return value;
}

const wrapSync: ILogger['wrapSync'] = (label, fun) => {
  console.info(`// ${label}`);

  const log: ILoggerConsole['log'] = (key, data) => {
    if (data) {
      wrappedConsole.info(key, JSON.parse(
        JSON.stringify(data, jsonReplacer),
      ));
    } else {
      wrappedConsole.info(key);
    }
    return data;
  };

  const error: ILoggerConsole['error'] = (err) => {
    wrappedConsole.error(err);
  };

  const wrapper = async () => {
    return Promise.resolve(fun({
      log,
      error,
    }));
  };

  wrapper()
    .catch(error);
};

export const logger: ILogger = {
  stream$,
  wrapSync,
};
